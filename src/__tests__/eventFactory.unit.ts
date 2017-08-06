import { expect } from 'chai';
import { eventFactory } from './../index';

describe('@jdw/blabbermouth/eventFactory::unit-test', () => {
  it('can create an event using defaults', () => {
    const fixture = { foo: 'bar ' };
    const event: Blabbermouth.Event = eventFactory('topic.test', fixture);

    expect(event).to.have.property('topicId');
    expect(event).to.have.property('content');
    expect(event).to.have.property('createdAt');
    expect(event).to.have.property('uuid');
    expect(event.content).to.deep.eq(fixture);
  });
});
