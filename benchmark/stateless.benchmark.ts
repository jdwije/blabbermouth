import { has } from 'lodash';
import benchmark from './lib/benchmark';
import fibonacci from './lib/fibonacci';
import httpTopics from './lib/httpTopics';
import { Blabbermouth } from './../src/index';
import * as services from './lib/services';

// const maxHandlers = process.env.MAX_HANDLERS | 100;
const maxMessages = has(process.env, 'MAX_MESSAGES')
  ? process.env.MAX_MESSAGES : 1000;
const maxFibLimit = has(process.env, 'FIB_MAX_LIMIT')
  ? process.env.FIB_MAX_LIMIT : 100;

const cb = (r) => {
  return r;
};

benchmark(
  'benchmark: @jdw/blabbermouth/Blabbermouth',
  'Testing the performance of non io bound Fibonacci generation',
  [{
    id: '@native/synchronous::',
    exec: () => {
      let i = 0;
      const data = [];
      while (i < maxMessages) {
        i++;
        data.push(fibonacci(maxFibLimit));
      }

      cb({
        maxMessages,
        maxFibLimit,
        data
      });
    }
  }, {
    id: '@jdw/blabbermouth/Blabbermouth::distributed',
    exec: () => {
      const bm = new Blabbermouth();
      const callback = (r) => {
        return r;
      };

      bm.createTopic(httpTopics.httpRequest)
        .createTopic(httpTopics.httpResponse)
        .createTopic(httpTopics.fibonacciRequest)
        .createTopic(httpTopics.fibonacciResponse)
        .subscribe(httpTopics.httpRequest.id, services.fibonacci)
        .subscribe(
        httpTopics.fibonacciResponse.id,
        services.response(maxMessages)
        )
        .subscribe(httpTopics.httpResponse.id, async (event) => {
          callback(event.content);

          return event.content;
        });
      let i = 0;
      while (i < maxMessages) {
        i++;
        bm.publish(httpTopics.httpRequest.id, {
          sequenceLimit: maxFibLimit
        });
      }
    }
  }]
);
