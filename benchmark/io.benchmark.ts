import benchmark from './lib/benchmark';
import { Blabbermouth } from './../src/index';
import topics from './lib/httpTopics';
import * as services from './lib/services';
import { readFileSync, writeFileSync } from 'fs';

const maxMessages = process.env.MAX_MESSAGES | 5;

benchmark(
    'benchmark: @jdw/blabbermouth/Blabbermouth',
    'Testing the performance of io bound file manipulation',
    [{
        id: `@native/synchronous::`,
        exec: () => {
            let i = 0;
            const data = {
                foo: 'bar',
                bar: 'foo',
            };
            while (i < maxMessages) {
                i++;
                const path = `tmp/${i}-fixture.json`;
                writeFileSync(path, JSON.stringify(data));
                const content = readFileSync(path);
                content && typeof content === 'string';
            }
        }
    }, {
        id: '@jdw/blabbermouth/Blabbermouth::distributed',
        exec: async () => {
            const bm = new Blabbermouth();
            const callback = (r) => {
                return r;
            };
            bm.createTopic(topics.httpRequest)
                .createTopic(topics.httpResponse)
                .createTopic(topics.writeFileRequest)
                .createTopic(topics.readFileResponse)
                .subscribe(topics.writeFileRequest.id, services.writeFile)
                .subscribe(
                topics.writeFileResponse.id,
                services.readFile
                )
                .subscribe(topics.readFileResponse.id, async (b, event) => {
                    b && callback(event.content);
                    return event.content;
                });
            let i = 0;
            while (i < maxMessages) {
                i++;
                bm.publish(topics.writeFileRequest.id, {
                    path: `tmp/${i}-async.json`,
                    content: {
                        foo: 'bar',
                        bar: 'foo',
                    },
                });
            }
        },
    }]
);
