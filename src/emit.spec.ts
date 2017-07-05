import { emit } from './index';
import { expect } from 'chai';

describe('@jdw/blabbermouth/emit', () => {
    const mockDist: Blabbermouth.IDistributor = {
        createTopic: (topic) => topic && mockDist,
        deleteTopic: (topic) => topic && mockDist,
        distribute: (event, topicId) => new Promise((r) => r({ event, topicId })),
        getTopic: (topicId) => {
            return { id: topicId, description: 'foo' };
        },
        listTopics: () => [],
        register: (subscriber) => subscriber && mockDist,
    };

    it('can promise the distribution of event data', () => {
        const result = emit('foo', { bar: 'bar' }, mockDist);

        expect(result).to.be.an.instanceOf(Promise);

        return result.then((data: any) => {
            expect(data.event).to.have.property('content');
            expect(data.event).to.have.property('createdAt');
            expect(data.event).to.have.property('uuid');
            expect(data.topicId).to.eq('foo');
        });
    });
});
