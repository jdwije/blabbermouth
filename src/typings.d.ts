/**
 * Blabbermouth is a publish-subscriber (pub-sub) pattern implementation for nodeJS and
 * the browser.
 *
 * # Ambitions
 *
 * It is envisaged that blabbermouth be a simple and effective tool for passing notifications
 * asynchronously to a number of services for further processing and then later being able to
 * collate their responses. Blabbermouth will focus on in-memory applications of the pub-sub
 * pattern however its interfaces should be designed to allow breaking it up at a later stage 
 * into distributed processes.
 *
 * - Simplicity: It should be dead simple to use . The only features we are interested in
 *   are the goals in this list plus message passing.
 *
 * - Extensible: It should be straight-forward to extend this software in meaningful ways,
 *   add inovative features whilst reusing working code, and to be able to do this outside
 *   of the core package.
 *
 * - Performance: It should strive to use best in class algorithms and techniques to achive
 *   its ends.
 *
 */
declare module Blabbermouth {
    /**
     * A topic is an abstract subject matter of interest. This concept is used to
     * pair a relavant event with subscribers interested in the topic.
     */
    export type Topic = {
        description?: string;
        id: string;             // a unique key to identify this topic with
    }

    /**
     * An event is a user triggered occurence. It is uniquely identifiable, time
     * sensitive, and has content.
     */
    export type Event = {
        content: Object; // a json object
        createdAt: Date;
        uuid: string;
    }

    /**
     * This signature describes an emitter function. It matches content with
     * topics and publishes them via a distributor.
     */
    export type Publisher =
        (topicId: string, content: Object, dist: IDistributor) => Promise<Object>;

    /**
     * This interface describes a subscriber object. It expects to recieve
     * notifications about topics it is interested in.
     */
    export interface ISubscriber {
        kill: () => Promise<Object>;
        listTopics: () => Topic[];
        notify: (topicId: string, event: Event) => Promise<Object>;
    }

    /**
     * This interface describes a distributor object. It is expected to maintain
     * a list of topics and their subscribers. It handles distributing events to
     * relevant subscribers.
     */
    export interface IDistributor {
        createTopic: (topic: Topic) => IDistributor;
        deleteTopic: (topic: Topic) => IDistributor;
        distribute: (event: Event, topicId: string) => Promise<Object>;
        getTopic: (topicId: string) => Topic;
        listTopics: () => Topic[];
        register: (subscriber: ISubscriber) => IDistributor;
    }
}
