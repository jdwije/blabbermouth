import { Distributor, emit } from './index';

/**
 * Blabbermouth is the public interface of this library. Whilst all its pieces
 * are designed to be de-coupled and re-usable, this class ties together all of
 * thse into a opinionated and productive interface.
 */
class Blabbermouth {
    private distributor;
    private RequestResponse;

    constructor(distributor: Blabbermouth.IDistributor = new Distributor(),
        publish: Blabbermouth.RequestResponse = emit) {
        this.distributor = distributor;
        this.RequestResponse = publish;
    }

    publish() {
        return this.RequestResponse.apply(this, arguments);
    }

    collect() {

    }
};

export default Blabbermouth;
