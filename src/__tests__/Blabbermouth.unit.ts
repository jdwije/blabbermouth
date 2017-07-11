import { Blabbermouth } from './../index';
import { expect } from 'chai';

describe('@jdw/blabbermouth/Blabbermouth::unit-test', () => {
  it('can be initialised with a default argument', () => {
    expect(new Blabbermouth()).to.be.instanceOf(Blabbermouth);
  });

  it('can do pub-sub style messaging', async () => {
    const bm = new Blabbermouth();
    const fixture = {
      data: 'foo',
    };

    const response = bm.createTopic({
      id: 'test.topic',
      description: 'test description'
    }).subscribe(['test.topic'], async (b, event) => {
      b && expect(event.content).to.deep.eq(fixture);
      return {};
    }).publish('test.topic', fixture);

    expect(response).to.be.instanceOf(Blabbermouth);
  });

  it('can do request-response style messaging', async () => {
    const bm = new Blabbermouth();
    const fixture = {
      data: 'foo',
    };
    let test = false;
    const responseFixture = { funky: 'object' };
    const response = await bm.createTopic({
      id: 'test.topic',
      description: 'test description'
    }).subscribe('test.topic', async (b, event) => {
      b && expect(event.content).to.deep.eq(fixture);
      test = true;
      return responseFixture;
    }).request('test.topic', fixture);

    expect(test).to.eq(true);
    expect(response).to.deep.eq([responseFixture]);
  });
});
