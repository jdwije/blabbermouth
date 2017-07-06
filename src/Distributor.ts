/**
 * Blabbermouth's default in-memory distributor.
 */
export default class Distributor implements Blabbermouth.IDistributor {
    private topics = {};

    createTopic(topic) {
        if (this.topics.hasOwnProperty(topic.id))
            throw Error(`Duplicate topic with id: ${topic}`);

        this.topics[topic.id] = {
            topic,
            subscribers: []
        };

        return this;
    }

    deleteTopic(topicId) {
        if (this.topics.hasOwnProperty(topicId)) {
            this.topics[topicId].subscribers.forEach(sub => sub.kill());

            delete this.topics[topicId];
        }
        return this;
    }

    getTopic(topicId) {
        if (!this.topics.hasOwnProperty(topicId)) return undefined;
        else return this.topics[topicId].topic;
    }

    listTopics() {
        const list = [];

        for (const topic in this.topics) {
            if (this.topics.hasOwnProperty(topic)) {
                list.push(this.topics[topic].topic);
            }
        }

        return list;
    }

    register(subscriber) {
        subscriber.listTopics().forEach((t) => {
            if (!this.getTopic(t.id)) this.createTopic(t);

            this.topics[t.id].subscribers.push(subscriber);
        });

        return this;
    }

    async distribute(event, topicId) {
        if (!this.getTopic(topicId)) {
            throw new Error(`Non-existant topic with id: ${topicId}`);
        }

        return Promise.all(
            this.topics[topicId]
                .subscribers
                .map(async s => await s.notify(topicId, event)));
    }
};
