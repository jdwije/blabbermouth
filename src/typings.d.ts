/**
 * Blabbermouth is an asynchronous messaging library for NodeJS. It is designed
 * to be simple, extensible, and performant. It provides out of the box support
 * for publish-subscribe and request-response style messaging patterns. With a
 * bit of extra work it can also be adapted to RPC (remote procedure call)
 * request-response style architectures.
 *
 * # Ambitions
 *
 * It is envisaged that blabbermouth be a simple and effective tool for passing
 * notifications asynchronously to a number of services for further
 * processing. Blabbermouth will initially focus on in-memory applications of
 * the pub-sub and req-res patterns however its interfaces should be designed to
 * allow breaking it up at a later stage into distributed processes.
 *
 * - Simplicity: It should be dead simple to use . The only features we are
 *   interested in are the goals in this list + message passing.
 *
 * - Extensible: It should be straight-forward to extend this software in
 *   meaningful ways, add innovative features whilst reusing working code, and
 *   to be able to do this outside of the core package.
 *
 * - Performance: It should strive to use best in class algorithms and
 *   techniques to achieve its ends.
 */
declare module Blabbermouth {
    /**
     * A topic is an abstract subject matter of interest. This concept is used
     * to pair a relevant event with subscribers interested in the topic.
     */
    export type Topic = {
        description?: string;
        id: string;             // a unique key to identify this topic with
    }

    /**
     * An event is a user triggered occurrence. It is uniquely identifiable,
     * time sensitive, and has content.
     */
    export type Event = {
        content: Object; // a json object
        createdAt: Date;
        uuid: string;
    }

    /**
     * This signature describes a request-response style messaging function. It
     * pushes content via a distributor out to the relevant handlers, and
     * collect their results. This is a request-response style messaging
     * pattern, useful for connecting a client to a set of services.
     */
    export type RequestResponse =
        (topicId: string, content: Object, dist: IDistributor) => Promise<Object>;

    /**
     * This signature describes a pusher function. It pushes content via a
     * distributor out to the relevant handlers, and DOES NOT collect their
     * results. This is a pub-sub messaging pattern, useful for data
     * distribution to many services.
     */
    export type PublishSubscribe =
        (topicId: string, content: Object, dist: IDistributor) => void;

    /**
     * This signature describes a subscriber function. It expects to receive
     * notifications about topics it is interested in.
     */
    export type Subscriber = (topicId: string, event: Event) => Promise<Object>;

    /**
     * This interface describes a topic manager object. It is expected to
     * maintain a list of topics and their subscribers.
     */
    export interface ITopicManager {
        create: (topic: Topic) => ITopicManager;
        delete: (topicId: string) => ITopicManager;
        get: (topicId: string) => Topic;
        list: () => Topic[];
    }

    /**
     * It handles distributing events to relevant subscribers. It maintains a
     * list of topics and the services interested in them.
     */
    export interface IDistributor extends ITopicManager {
        distribute: (topicId: string, event: Event) => Promise<Object[]>;
        register: (topicsIds: string[], subscriber: Subscriber) => IDistributor;
    }

    /**
     * This interface describes the blabbermouth packages' public API. Using all
     * other types and interfaces defined within the library, this object ties
     * together all of this functionality into a cohesive piece of software.
     */
    export interface IBlabber {
        publish: (topicId: string, content: Object) => IBlabber,
        collect: (topicId: string, content: Object) => Promise<Object[]>;
    }
}
