import fib from './../fibonacci';
import topics from './../httpTopics';

const fibonacci = async (event, bm) => {
  const r = {
    type: topics.fibonacciResponse.id,
    data: fib(event.content.sequenceLimit),
  };

  bm.publish(topics.fibonacciResponse.id, r);

  return r;
};

export default fibonacci;
