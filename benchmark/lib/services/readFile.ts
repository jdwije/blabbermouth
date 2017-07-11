import topics from './../httpTopics';
import { readFile } from 'fs';

const readFileService = async (bm, event) => {
    const t = topics.readFileResponse.id;
    const path = `${event.content.path}`;
    readFile(path, (err, data) => {
        if (err) return err;
        const r = {
            type: t,
            path,
            content: data,
        };
        return bm.publish(t, r);
    });
    return {};
};

export default readFileService;
