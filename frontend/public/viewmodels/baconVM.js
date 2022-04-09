function BaconVM() {
  const self = this;

  self.baconCount = ko.observable(1);

  self.addBacon = function () {
    self.baconCount(self.baconCount() + 1);
  };
}

(function initApp() {
  const dependenciesLoaded = typeof ko !== 'undefined';

  if (dependenciesLoaded) {
    const app = {
      bacon: new BaconVM(),
    };
    window.app = app;
    ko.applyBindings(app);
  } else {
    setTimeout(initApp, 10);
  }
})();
