import { Blabbermouth } from '../src/index';
import { expect } from 'chai';

describe('@jdw/blabbermouth/Blabbermouth', () => {
  it('can be initialised with a default argument', () => {
    expect(new Blabbermouth()).to.be.instanceOf(Blabbermouth);
  });
});
