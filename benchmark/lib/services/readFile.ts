import topics from './../httpTopics';
import { readFile } from 'fs';

const readFileService = async (bm, event) => {
  const t = topics.readFileResponse.id;
  const path = event.content.path;
  readFile(path, (err, data) => {
    if (err) return err;
    const r = {
      type: t,
      path,
      data: data.toString(),
    };
    return bm.publish(t, r);
  });
  return {};
};

export default readFileService;
