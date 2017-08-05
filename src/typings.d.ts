// ## Blabbermouth
//
// Blabbermouth is a tiny library all about asynchronous message passing and
// service orientation. It ships with built-in support for powerful messaging
// patterns including:
// 
// - publish-subscribe
// - request-response
// - fan-in
// - fan-out
// 
// It is well specified and simple by design, making it easy to extend and adapt
// to new use cases. Whilst Blabbermouth focuses on in-process asynchronous
// messaging, its internals are designed in such a way as to allow distributing
// execution of services across multiple processes and/or compute nodes.

declare module Blabbermouth {
    // ### Data-Structures

    // A **Topic** is an abstract subject matter of interest. This concept is used
    // to pair a relevant event with subscribers interested in that topic.
    export type Topic = {
        description?: string;
        id: string;
    };

    // An **Event** is a user triggered occurrence. It is uniquely identifiable,
    // time sensitive, and has content.
    export type Event = {
        content: Object; // a json object
        createdAt: Date;
        uuid: string;
        topic: Topic;
    }

    // A **Receipt** describes a guarantee that a message was delivered to a
    // particular service.
    type Reciept = {
        uuid: string,
        topicId: string,
    };

    // ### Functions

    // This signature describes a request-response style messaging function. It
    // pushes content via a distributor out to the relevant handlers, and
    // collect their results. This is a request-response style messaging
    // pattern, useful for connecting a client to a set of services.
    export type RequestResponse =
        (topicId: string, content: Object, dist: IDistributor) => Promise<Object>;

    // This signature describes a pusher function. It pushes content via a
    // distributor out to the relevant handlers, and DOES NOT collect their
    // results. This is a pub-sub messaging pattern, useful for data
    // distribution to many services.
    export type PublishSubscribe =
        (topicId: string, content: Object, dist: IDistributor) => void;

    // This signature describes a subscriber function. It expects to receive
    // notifications about topics it is interested in.
    export type Subscriber = (event: Event, blabbermouth: IBlabber)
        => Promise<Object> | void;

    // This interface describes a topic manager object. It is expected to
    // maintain a list of topics and their subscribers.
    export interface ITopicManager {
        createTopic: (topic: Topic) => ITopicManager;
        deleteTopic: (topicId: string) => ITopicManager;
        getTopic: (topicId: string) => Topic;
        listTopics: () => Topic[];
    }

    // It handles distributing events to relevant subscribers. It maintains a
    // list of topics and the services interested in them.
    export interface IDistributor extends ITopicManager {
        publish: (topicId: string, event: Event, subscriber?: Subscriber)
            => IDistributor;
        request: (topicId: string, event: Event, subscriber?: Subscriber)
            => Promise<Object[]>;
        subscribe: (topicId: string, subscriber: Subscriber) => IDistributor;
    }

    // This interface describes the blabbermouth packages' public API. Using all
    // other types and interfaces defined within the library, this object ties
    // together all of this functionality into a cohesive piece of software.
    export interface IBlabber {
        publish: (topicId: string | string[], data: Object, subscriber?: Subscriber)
            => IDistributor;
        request: (topicId: string | string[], data: Object, subscriber?: Subscriber)
            => Promise<Object[]>;
        subscribe: (topicId: string | string[], subscriber: Subscriber) => IBlabber;
    }
}
