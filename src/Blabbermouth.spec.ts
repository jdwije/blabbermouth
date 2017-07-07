import { Blabbermouth } from './index';
import { expect } from 'chai';

describe('@jdw/blabbermouth/Blabbermouth', () => {
    it('can be initialised with a default argument', () => {
        expect(new Blabbermouth()).to.be.instanceOf(Blabbermouth);
    });

    it('can do pub-sub style messaging', async () => {
        const bm = new Blabbermouth();
        const fixture = {
            data: 'foo',
        };
        let test = false;

        const response = await bm.createTopic({
            id: 'test.topic',
            description: 'test description'
        }).registerHandler(['test.topic'], async (topicId, event) => {
            expect(topicId).to.eq('test.topic');
            expect(event.content).to.deep.eq(fixture);
            test = true;
            return {};
        }).publish('test.topic', fixture);

        expect(test).to.eq(true);
        expect(response).to.eq(undefined);
    });

    it('can do request-response style messaging', async () => {
        const bm = new Blabbermouth();
        const fixture = {
            data: 'foo',
        };
        let test = false;
        const responseFixture = { funky: 'object' };
        const response = await bm.createTopic({
            id: 'test.topic',
            description: 'test description'
        }).registerHandler(['test.topic'], async (topicId, event) => {
            expect(topicId).to.eq('test.topic');
            expect(event.content).to.deep.eq(fixture);
            test = true;
            return responseFixture;
        }).collect('test.topic', fixture);

        expect(test).to.eq(true);
        expect(response).to.deep.eq([responseFixture]);
    });
});
