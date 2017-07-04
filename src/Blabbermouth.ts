/**
 * Lightweight and extensible pub-sub.
 */
export default class Blabbermouth implements Blabbermouth.Subject {
    readonly subscribers: Blabbermouth.Subscriber[];

    /**
     * @param subscribers An optional array of subscribers to initialise with;.
     */
    constructor(subscribers?: Blabbermouth.Subscriber[]) {
        this.subscribers = subscribers ? subscribers : [];
    }

    /**
     * Register a new event subscriber with blabbermouth.
     */
    register(subscriber: Blabbermouth.Subscriber): boolean {
        this.subscribers.push(subscriber);

        return true;
    }

    /**
     * emit an event notifying all relevant subscribers.
     *
     * @param event
     * @param context
     */
    emit(id: string, event: Blabbermouth.Event): any[] {
        return this
            .subscribers
            .filter(sub => sub.events.filter(e => e === id).length > 0)
            .map(async sub => await sub.notify(id, event));
    }
};
