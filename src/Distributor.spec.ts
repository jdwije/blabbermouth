import { Distributor } from './index';
import { expect } from 'chai';

describe('@jdw/blabbermouth/Distributor', () => {
    it('can be initialised ', () => {
        expect(new Distributor()).to.be.instanceOf(Distributor);
    });
});
