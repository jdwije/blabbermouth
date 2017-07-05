import * as uuidv4 from 'uuid/v4';

/**
 * A simple factory function for creating event objects.
 */
const eventFactory = (content: Object, uuid: string = null, createdAt: Date = null) => {
    return {
        content,
        uuid: uuid ? uuid : uuidv4(),
        createdAt: createdAt ? createdAt : new Date(),
    };
};

export default eventFactory;
