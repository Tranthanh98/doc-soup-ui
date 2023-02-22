class CreateLinkStrategy {
  constructor() {
    this._strategy = null;
  }

  set strategy(strategy) {
    this._strategy = strategy;
  }

  create(parmas) {
    return this._strategy.create(parmas);
  }
}
export default CreateLinkStrategy;
