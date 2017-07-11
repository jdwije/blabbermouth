import fib from './../fibonacci';
import topics from './../httpTopics';

const fibonacci = (bm) => {
  return async (topicId, event) => {
    const r = {
      type: topics.fibonacciResponse.id,
      data: fib(event.content.sequenceLimit),
    };
    topicId && await bm.publish(topics.fibonacciResponse.id, r);
    return r;
  };
}
export default fibonacci;
