import { Distributor } from './index';
import { expect } from 'chai';

describe('@jdw/blabbermouth/Distributor', () => {
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
        expect(dist.create(fixture)).to.be.instanceOf(Distributor);
    });

    it('can get a previously created topic', () => {
        expect(dist.get(id)).to.deep.eq(fixture);
    });

    it('can list previously created topics', () => {
        expect(dist.list()).to.deep.eq([fixture]);
    });

    it('can delete a previously created topic', () => {
        expect(dist.delete(id)).to.be.instanceOf(Distributor);
        expect(dist.list()).to.deep.eq([]);
        expect(dist.get(id)).to.eq(undefined);
    });

    it('can register a handler and distribute an events to it', async () => {
        const content = {
            a: 'b',
        };
        dist.create(fixture)
            .register([fixture.id], async (topic, event) => {
                expect(topic).to.eq(id);
                expect(event.content).to.deep.eq(content)

                return { b: 'a' };
            });
        expect(dist.get(id)).to.deep.eq(fixture);
        const chatter = await dist.distribute(id, {
            content,
            createdAt: new Date(),
            uuid: 'abcde12345',
        });
        expect(chatter).to.deep.eq([{
            b: 'a',
        }]);
    });
});
