import { eventFactory } from './index';

const emit: Blabbermouth.Publisher = async (topicId, content, distributor) => {
    if (!distributor.getTopic(topicId))
        throw new Error(`topic not found: ${topicId}`);

    const event: Blabbermouth.Event = eventFactory(content);

    return distributor.distribute(event, topicId);
};

export default emit;
