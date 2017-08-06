import { expect } from 'chai';
import { Blabbermouth } from './../index';

describe('@jdw/blabbermouth/Blabbermouth::boundry-test', () => {
  const maxHandlers = process.env.hasOwnProperty('MAX_HANDLERS')
    ? process.env.MAX_HANDLERS : 100;
  const maxMessages = process.env.hasOwnProperty('MAX_MESSAGES')
    ? process.env.MAX_MESSAGES : 10000;
  const maxFibLimit = process.env.hasOwnProperty('FIB_MAX_LIMIT')
    ? process.env.FIB_MAX_LIMIT : 1000;
  const httpRequest = {
    id: 'http.request',
    description: 'blah'
  };
  const httpResponse = {
    id: 'http.response',
    description: 'blah'
  };
  const processComplete = {
    id: 'process.complete',
    description: 'blah'
  };

  it(`can reasonably process ${maxMessages} concurrent requests for a fib sequece of ${maxFibLimit} length`, async () => {
    /**
     * In this test we try to use the library in a tiny evented architecture
     * running at a reasonable level of concurrency. The example will attempt to
     * be somewhat realistic and we will base it upon the workflow of a simple
     * HTTP server.
     */
    const bm = new Blabbermouth();

    const fibService = (event, b) => {
      let i;
      const fib = []; // Initialize array!
      const limit = event.content.limit;
      fib[0] = 0;
      fib[1] = 1;
      for (i = 2; i <= limit; i++) {
        // Next fibonacci number = previous + one before previous
        fib[i] = parseFloat(fib[i - 2]) + parseFloat(fib[i - 1]);
      }

      const res = {
        fib,
        limit,
        start: 0
      };

      b.publish('process.complete', res);
    };
    const aggregator = () => {
      const responses = [];

      return async (event, b) => {
        responses.push(event.content);
        if (responses.length === maxMessages) {
          b.publish('http.response', {
            type: 'Fibonacci Sequences',
            size: maxMessages,
            data: responses
          });
        }
      };
    };
    const mockRequest = {
      limit: maxFibLimit
    };

    bm.createTopic(httpRequest).createTopic(httpResponse).createTopic(processComplete);
    bm.subscribe('process.complete', aggregator());
    bm.subscribe('http.request', fibService);
    // here begins the test
    let i = 0;
    const op = (req, res) => {
      const respond = async (event) => {
        res(event.content);
      };
      bm.subscribe('http.response', respond);

      while (i < maxMessages) {
        i++;
        bm.publish('http.request', req);
      }
    };

    op(mockRequest, (response) => {
      expect(response.data.length).to.eq(maxMessages);
    });

  });

  it(`can work with a variable range of handlers from 1 to ${maxHandlers}`, async () => {
    const bm = new Blabbermouth();
    const fixture = {
      data: 'foo'
    };
    const responseFixture = { funky: 'object' };
    bm.createTopic({
      id: 'test.topic',
      description: 'test description'
    });
    let i = 0;
    while (i < maxHandlers) {
      let test = false;
      const response = await bm.subscribe('test.topic', async (event) => {
        expect(event.content).to.deep.eq(fixture);
        test = true;

        return responseFixture;
      }).request('test.topic', fixture);
      expect(test).to.eq(true);
      expect(response[i]).to.deep.eq(responseFixture);
      i++;
    }
  });
});
