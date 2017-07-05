/**
 * Blabbermouth's default in-memory distributor.
 */
export default class Distributor implements Blabbermouth.IDistributor {
    constructor() {

    }

    createTopic(topic) {
        return this;
    }

    deleteTopic(topic) {
        return this;
    }

    getTopic(topicId) {

    }

    listTopics() {

    }

    register(subscriber) {

    }

    async distribute(event, topicId) {

    }
};
