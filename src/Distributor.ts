import { eventFactory, Blabbermouth } from './index';

/**
 * Blabbermouth's default in-memory distributor.
 */
export default class Distributor implements Blabbermouth.IDistributor {
  private topics = {};
  private errorMessages = {
    'topic.duplicate': 'operation resulted in a duplicate topic',
    'topic.undefined': 'could not find topic by id',
    'subscriber.init': 'failed to initialise a subscriber',
  };

  private getErrorMessage(id, context: any) {
    if (!this.errorMessages.hasOwnProperty(id)) {
      throw new Error(`non-existant error id: ${id}`);
    }

    return `${this.errorMessages[id]}: ${context.toString()}`;
  }

  createTopic(topic) {
    if (this.getTopic(topic.id)) {
      throw Error(this.getErrorMessage('topic.duplicate', topic.id));
    }

    this.topics[topic.id] = {
      topic,
      subscribers: []
    };

    return this;
  }

  deleteTopic(topicId) {
    if (this.getTopic(topicId)) {
      delete this.topics[topicId];
    }
    return this;
  }

  getTopic(topicId) {
    return this.topics.hasOwnProperty(topicId)
      ? this.topics[topicId].topic : undefined;
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

  subscribe(topicId, subscriber) {
    if (!this.getTopic(topicId)) {
      throw new Error(JSON.stringify([
        this.getErrorMessage('subscriber.init', subscriber),
        this.getErrorMessage('topic.undefined', topicId)
      ]));
    }

    this.topics[topicId].subscribers.push(subscriber);

    return this;
  }

  publish(topicId, event, subscriber) {
    if (!this.getTopic(topicId)) {
      throw new Error(this.getErrorMessage('topic.undefined', topicId));
    }
    const bm = new Blabbermouth(this);

    Promise.all(
      this.topics[topicId]
        .subscribers
        .map((sub) => sub(bm, event))
    ).then((data) => {
      subscriber && subscriber(bm, eventFactory(topicId, data.map(() => {
        return {
          uuid: event.uuid,
          topicId,
        };
      })));
    });

    return this;
  }

  async request(topicId, event, subscriber?) {
    if (!this.getTopic(topicId)) {
      throw new Error(this.getErrorMessage('topic.undefined', topicId));
    }

    const subscribers = this.topics[topicId].subscribers;
    const bm = new Blabbermouth(this);
    let data = [];
    let i = 0;

    while (i < subscribers.length) {
      data.push(await subscribers[i](bm, event));
      i++;
    }

    subscriber && subscriber(bm, eventFactory(topicId, data));

    return data;
  }
};
