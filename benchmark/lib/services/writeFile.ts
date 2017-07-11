import topics from './../httpTopics';
import { writeFile } from 'fs';

const writeFileService = (bm) => {
  return async (topicId, event) => {
    const t = topics.writeFileResponse.id;
    const path = `${event.content.path}`;
    const content = `${event.content.content}`;
    await writeFile(path, JSON.stringify(content));
    const r = {
      type: t,
      path,
    };
    event && topicId && await bm.publish(t, r);
    return r;
  };
}
export default writeFileService;
