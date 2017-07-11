import topics from './../httpTopics';
import { writeFile } from 'fs';

const writeFileService = async (bm, event) => {
    const t = topics.writeFileResponse.id;
    const path = `${event.content.path}`;
    const content = `${event.content.content}`;
    await writeFile(path, JSON.stringify(content));
    const r = {
        type: t,
        path,
    };
    bm.publish(t, r);

    return r;
};

export default writeFileService;
