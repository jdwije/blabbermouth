import { Distributor } from './../index';
import { expect } from 'chai';

describe('@jdw/blabbermouth/Distributor::unit-test', () => {
    const dist = new Distributor();
    const id = 'foo.topic';
    const fixture = {
        id,
        description: 'all about the foo bars.'
    };

    it('can be initialised ', () => {
        expect(dist).to.be.instanceOf(Distributor);
    });

    it('can create a topic', () => {
        expect(dist.createTopic(fixture)).to.be.instanceOf(Distributor);
    });

    it('can get a previously created topic', () => {
        expect(dist.getTopic(id)).to.deep.eq(fixture);
    });

    it('can list previously created topics', () => {
        expect(dist.listTopics()).to.deep.eq([fixture]);
    });

    it('can delete a previously created topic', () => {
        expect(dist.deleteTopic(id)).to.be.instanceOf(Distributor);
        expect(dist.listTopics()).to.deep.eq([]);
        expect(dist.getTopic(id)).to.eq(undefined);
    });

    it('can register a subscriber and request of it', async () => {
        const content = {
            a: 'b',
        };
        dist.createTopic(fixture)
            .subscribe(fixture.id, async (event, bm) => {
                bm && expect(event.content).to.deep.eq(content)

                return { b: 'a' };
            });
        expect(dist.getTopic(id)).to.deep.eq(fixture);
        const response = await dist.request(id, {
            topicId: id,
            content,
            createdAt: new Date(),
            uuid: 'abcde12345',
        });

        expect(response).to.deep.eq([{
            b: 'a',
        }]);
    });

    it('can register a subscriber and publish to it', () => {
        const dist = new Distributor();
        dist.createTopic(fixture);
        const content = {
            a: 'b',
        };
        dist.subscribe(fixture.id, async (event, bm) => {
            bm && expect(event.content).to.deep.eq(content)

            return { b: 'a' };
        });
        expect(dist.getTopic(id)).to.deep.eq(fixture);
        dist.publish(
            id,
            {
                topicId: id,
                content,
                createdAt: new Date(),
                uuid: 'abcde12345',
            },
            async (event: Blabbermouth.Event, bm) => {
                bm && expect(event.content[0]).to.have.property('uuid');
                expect(event.content[0]).to.have.property('topicId');
            }
        );
    });
});
