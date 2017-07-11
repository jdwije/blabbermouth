import topics from './../httpTopics';
import { readFile } from 'fs';

const readFileService = (bm) => {
  return async (topicId, event) => {
    const t = topics.readFileResponse.id;
    const path = `${event.content.path}`;
    readFile(path, (err, data) => {
      if (err) return err;
      const r = {
        type: t,
        path,
        content: data,
      };
      return event && topicId && bm.publish(t, r);
    });
    return {};
  };
}
export default readFileService;
