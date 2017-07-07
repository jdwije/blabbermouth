import { eventFactory } from './index';

const emit: Blabbermouth.RequestResponse = async (topicId, content, distributor) => {
    if (!distributor.get(topicId))
        throw new Error(`topic not found: ${topicId}`);

    const event: Blabbermouth.Event = eventFactory(content);

    return distributor.distribute(topicId, event);
};

export default emit;
