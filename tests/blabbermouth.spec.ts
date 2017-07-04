import { Blabbermouth } from '../src/index';

describe('Blabbermouth', () => {
    it('can be initialised with a default argument', () => {
        expect(new Blabbermouth()).to.be.instanceOf(Blabbermouth);
    });
});
