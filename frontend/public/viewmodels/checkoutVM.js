function CheckoutVM() {
  const self = this;
  self.showErrors = ko.observable(false);
  self.sendingData = ko.observable(false);

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
      res.phone = 'Required format: (21) 692-93-92';
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

  self.send = async function () {
    self.showErrors(true);

    const formHasErrors = Object.keys(app.checkout.form()).length > 0;

    if (formHasErrors) {
      swal.fire({
        icon: 'error',
        title: 'Something is not right',
        text: 'Please fill all the required fields',
        width: '385px',
      });
      return;
    }

    self.sendingData(true);

    const rawResponse = await fetch('/order', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: self.firstName(),
        lastName: self.lastName(),
        email: self.email(),
        country: self.country(),
        postalCode: helper.filterDigitsOnly(self.postalCode()),
        phone: helper.filterDigitsOnly(self.phone()),
        creditCard: helper.filterDigitsOnly(self.creditCard()),
        CVV: self.securityCode(),
        expDate: self.expirationDate(),
      }),
    });
    const content = await rawResponse.json();

    if (content.errors) {
      swal.fire({
        icon: 'error',
        title: 'There has been an error',
        width: '385px',
        html: content.errors
          .map((item) => `Field '${item.field}' - ${item.message}`)
          .join('<br/> '),
      });
    } else {
      swal.fire({
        icon: 'success',
        title: 'Purchase order created',
        text: 'Data has been saved successfully',
        width: '385px',
      });
    }

    self.sendingData(false);
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
  },
  getDefaults: (slice) => {
    return JSON.parse(Defaults.replaceAll('&quot;', '"'))[slice];
  },
  filterDigitsOnly: (value) => {
    return value.replace(/[^\d.]/g, '');
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
    if (tag === 'phone') {
      return helper.filterDigitsOnly(value).length !== 9;
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
