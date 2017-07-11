Blabbermouth
===
> Lightweight asynchronous message passing for NodeJS.

## Quick Start

```bash
npm i -save @jdw/blabbermouth
```

```javascript
// es6
import { Blabbermouth } from '@jdw/blabbermouth';

// or es5...
const Blabbermouth = require('@jdw/blabbermouth').Blabbermouth;

const bm = new Blabbermouth();

// A quick pub-sub example
bm.createTopic({
    id: 'topic.id',
    description: 'Give the topic an extended description',
   })
  .register('topic.id', async (topicId, event) => {
      const { content, uuid, date } = event;
      console.log(content.message);
  })
  .publish(
    'topic.id',
    { message: 'Asynchronous messaging in action!' }
  );
```

The above example will produce the following message "Asynchronous messaging in
action!" on your command line.


## Contributing

