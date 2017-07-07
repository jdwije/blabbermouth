/**
 * Blabbermouth's default in-memory distributor.
 */
export default class Distributor implements Blabbermouth.IDistributor {
    private topics = {};

    create(topic) {
        if (this.topics.hasOwnProperty(topic.id))
            throw Error(`Duplicate topic with id: ${topic}`);

        this.topics[topic.id] = {
            topic,
            subscribers: []
        };

        return this;
    }

    delete(topicId) {
        if (this.topics.hasOwnProperty(topicId)) {
            this.topics[topicId].subscribers.forEach(sub => sub.kill());

            delete this.topics[topicId];
        }
        return this;
    }

    get(topicId) {
        if (!this.topics.hasOwnProperty(topicId)) return undefined;
        else return this.topics[topicId].topic;
    }

    list() {
        const list = [];

        for (const topic in this.topics) {
            if (this.topics.hasOwnProperty(topic)) {
                list.push(this.topics[topic].topic);
            }
        }

        return list;
    }

    register(topicIds, subscriber) {
        topicIds.forEach((t) => {
            if (!this.get(t))
                throw new Error(
                    `Tried registering handler with non-existant topic id: ${t}`);

            this.topics[t].subscribers.push(subscriber);
        });

        return this;
    }

    async distribute(topicId, event) {
        if (!this.get(topicId)) {
            throw new Error(`Non-existant topic with id: ${topicId}`);
        }

        return Promise.all(
            this.topics[topicId]
                .subscribers
                .map(async s => await s(topicId, event)));
    }
};
