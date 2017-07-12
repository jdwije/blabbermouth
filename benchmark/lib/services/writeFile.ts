import topics from './../httpTopics';
import { writeFile } from 'fs';

const writeFileService = async (bm, event) => {
  const t = topics.writeFileResponse.id;
  const path = event.content.path;
  await writeFile(path, JSON.stringify(event.content.content));
  const r = {
    type: t,
    path,
  };
  bm.publish(t, r);
  return r;
};

export default writeFileService;
