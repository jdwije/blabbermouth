import { Distributor, eventFactory } from './index';

//  Blabbermouth is the public interface of this library. Whilst all its pieces
//  are designed to be de-coupled and re-usable, this class ties together all of
//  these into a cohesive and productive interface.
class Blabbermouth implements Blabbermouth.IBlabber {
    private distributor;
    // A Blabbermouth can be initialized with sane defaults, or optionally be
    // injected with an IDistrubtor implementation.
    constructor(distributor: Blabbermouth.IDistributor = new Distributor()) {
        this.distributor = distributor;
    }

    publish(topicId, data, subscriber?) {
        const topicIds = Array.isArray(topicId) ? topicId : [topicId];

        topicIds.map((id) => {
            const event = eventFactory(id, data);
            this.distributor.publish(id, event, subscriber);
        });

        return this;
    }

    async request(topicId, data, subscriber?) {
        const topicIds = Array.isArray(topicId) ? topicId : [topicId];
        let i = 0;
        let response = [];

        while (i < topicIds.length) {
            const event = eventFactory(topicIds[i], data);
            response = response.concat(
                await this.distributor.request(topicIds[i], event, subscriber));
            i++;
        }

        return response;
    }

    createTopic(topic: Blabbermouth.Topic) {
        this.distributor.createTopic(topic)

        return this;
    }

    deleteTopic(topicId: string) {
        this.distributor.deleteTopic(topicId);

        return this;
    }

    listTopics() {
        return this.distributor.list();
    }

    getTopic(topicId: string) {
        return this.distributor.getTopic(topicId);
    }

    subscribe(topicId, subscriber) {
        const topicIds = Array.isArray(topicId) ? topicId : [topicId];

        topicIds.forEach((id) => {
            this.distributor.subscribe(id, subscriber);
        });
        return this;
    }
};

export default Blabbermouth;
