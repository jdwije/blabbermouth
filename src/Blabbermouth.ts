import { Distributor, emit } from './index';

/**
 * Blabbermouth is the public interface of this library. Whilst all its pieces
 * are designed to be de-coupled and re-usable, this class ties together all of
 * thse into a opinionated and productive interface.
 */
class Blabbermouth {
    private distributor;
    private emit;

    constructor(distributor: Blabbermouth.IDistributor = new Distributor(),
        publish: Blabbermouth.RequestResponse = emit) {
        this.distributor = distributor;
        this.emit = publish;
    }

    async publish(topicId, content) {
        this.emit(topicId, content, this.distributor);
    }

    async collect(topicId, content) {
        return this.emit(topicId, content, this.distributor);
    }

    createTopic(topic: Blabbermouth.Topic) {
        this.distributor.create(topic)

        return this;
    }

    deleteTopic(topicId: string) {
        this.distributor.delete(topicId);

        return this;
    }

    listTopics() {
        return this.distributor.list();
    }

    getTopic(topicId: string) {
        return this.distributor.get(topicId);
    }

    registerHandler(topicId: string, handler: Blabbermouth.Subscriber) {
        this.distributor.register(topicId, handler);

        return this;
    }
};

export default Blabbermouth;
