declare module Blabbermouth {
    export type Event = {
        // A unique ID for this context.
        id: string,
        // A description of the event context.
        description: string,
        // Some informative data associated with this context.
        data: any,
    };

    export type Subscriber = {
        events: Array<string>,
        notify: (id: string, event: Event) => Promise<any>
    };

    export interface Subject {
        readonly subscribers: Array<Subscriber>;
        emit: (id: string, event: Event) => Array<any>;
    }
}
