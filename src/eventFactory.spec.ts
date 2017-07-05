import { eventFactory } from './index';
import { expect } from 'chai';

describe('@jdw/blabbermouth/eventFactory', () => {
    it('can create an event using defaults', () => {
        const fixture = { foo: 'bar ' };
        const event = eventFactory(fixture);

        expect(event).to.have.property('content');
        expect(event).to.have.property('createdAt');
        expect(event).to.have.property('uuid');
        expect(event.content).to.deep.eq(fixture);
    });
});
