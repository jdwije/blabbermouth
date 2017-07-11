import benchmark from './lib/benchmark';
import { Blabbermouth } from './../src/index';
import fib from './lib/fibonacci';
import topics from './lib/httpTopics';
import * as services from './lib/services';

// const maxHandlers = process.env.MAX_HANDLERS | 100;
const maxMessages = process.env.MAX_MESSAGES | 1000;
const maxFibLimit = process.env.FIB_MAX_LIMIT | 100;

const cb = (r) => {
  //  console.log(`response.data.length::${r.data.length}`);
  return r;
};

benchmark(
  'benchmark: @jdw/blabbermouth/Blabbermouth',
  'Testing the performance of non io bound Fibonacci generation',
  [{
    id: `@native/synchronous::`,
    exec: () => {
      let i = 0;
      let data = [];
      while (i < maxMessages) {
        i++;
        data.push(fib(maxFibLimit));
      }

      cb({
        maxMessages,
        maxFibLimit,
        data,
      });
    }
  }, {
    id: '@jdw/blabbermouth/Blabbermouth::distributed',
    exec: () => {
      const bm = new Blabbermouth();
      const callback = (r) => {
        return r;
      };

      bm.createTopic(topics.httpRequest)
        .createTopic(topics.httpResponse)
        .createTopic(topics.fibonacciRequest)
        .createTopic(topics.fibonacciResponse)
        .registerHandler([topics.httpRequest.id], services.fibonacci(bm))
        .registerHandler(
        [topics.fibonacciResponse.id],
        services.response(bm, maxMessages)
        )
        .registerHandler([topics.httpResponse.id], async (topicId, event) => {
          topicId && callback(event.content);
          return event.content;
        });
      let i = 0;
      while (i < maxMessages) {
        i++;
        bm.publish(topics.httpRequest.id, {
          sequenceLimit: maxFibLimit,
        });
      }
    },
  }]
);
