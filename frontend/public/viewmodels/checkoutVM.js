function CheckoutVM() {
  const self = this;
  self.showErrors = ko.observable(false);

  self.firstName = ko.observable('');
  self.lastName = ko.observable('');
  self.email = ko.observable('');
  self.country = ko.observable('US');
  self.postalCode = ko.observable('');
  self.phone = ko.observable('');
  self.creditCard = ko.observable('');
  self.securityCode = ko.observable('');
  self.expirationDate = ko.observable('');

  self.countries = [
    { value: 'US', text: 'United States' },
    { value: 'NZ', text: 'New Zealand' },
    { value: 'CA', text: 'Canada' },
    { value: 'UA', text: 'Ukraine' },
  ];

  self.selectedCountryText = ko.computed(() => {
    return self.countries.find((c) => c.value === self.country()).text;
  });

  self.form = ko.computed(() => {
    if (!self.showErrors()) {
      return {};
    }
    const res = {};

    if (validate(self.firstName(), 'required')) {
      res.firstName = 'Field is required';
    }
    if (validate(self.lastName(), 'required')) {
      res.lastName = 'Field is required';
    }
    if (validate(self.email(), 'email')) {
      res.email = 'Field is not valid';
    }
    if (validate(self.postalCode(), 'postalCode')) {
      res.postalCode = 'Required format: 10001';
    }
    if (validate(self.country(), 'required')) {
      res.country = 'Field is required';
    }
    if (validate(self.phone(), 'phone')) {
      res.phone = 'Required format: (212) 692-93-92';
    }
    if (validate(self.creditCard(), 'creditCard')) {
      res.creditCard = 'Required format: 0000 — 0000 — 0000 — 0000';
    }
    if (validate(self.securityCode(), 'securityCode')) {
      res.securityCode = 'Required format: 123';
    }
    if (validate(self.expirationDate(), 'expirationDate')) {
      res.expirationDate = 'Required format: MM / YY';
    }

    return res;
  });

  self.send = function () {
    self.showErrors(true);
  };
}

function CartVM() {
  const self = this;

  const cart = helper.getDefaults('cart');
  self.items = cart.items;
  self.totals = cart.totals;
}

const helper = {
  regex: {
    postalCode: /\b\d{5}\b/g,
    creditCard: /^[0-9]{16}$/g,
    securityCode: /\b\d{3}\b/g,
    expirationDate: /^(0[1-9]|1[0-2])\/?([0-9]{2})$/g,
    email:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    phone:
      /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}\-\d{2}$/g,
  },
  getDefaults: (slice) => {
    return JSON.parse(Defaults.replaceAll('&quot;', '"'))[slice];
  },
};

const validate = (value, tag) => {
  if (tag === 'required') {
    return value.trim() === '';
  } else {
    const valueFormatted = value.trim().toLowerCase();

    if (tag === 'creditCard') {
      return !valueFormatted
        .replaceAll('-', '')
        .replaceAll('—', '')
        .replaceAll(' ', '')
        .match(helper.regex[tag]);
    }
    if (helper.regex[tag] && !!valueFormatted.match(helper.regex[tag])) {
      return false;
    }
    return true;
  }
};

(function initApp() {
  const dependenciesLoaded = typeof ko !== 'undefined';

  if (dependenciesLoaded) {
    const app = {
      checkout: new CheckoutVM(),
      cart: new CartVM(),
    };
    window['app'] = app;
    ko.applyBindings(app);
  } else {
    setTimeout(initApp, 10);
  }
})();
