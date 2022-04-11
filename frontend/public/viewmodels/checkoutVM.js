function CheckoutVM() {
  const self = this;
  self.showErrors = ko.observable(false);
  self.sendingData = ko.observable(false);

  self.firstName = ko.observable('').extend({ text: 50 });
  self.lastName = ko.observable('').extend({ text: 50 });
  self.email = ko.observable('').extend({ email: 100 });
  self.country = ko.observable('US');
  self.postalCode = ko.observable('').extend({ numeric: 5 });
  self.phone = ko.observable('').extend({ phone: 9 });
  self.creditCard = ko.observable('').extend({ creditCard: true });
  self.securityCode = ko.observable('').extend({ numeric: 3 });
  self.expirationDate = ko.observable('').extend({ creditCardExp: true });

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
    const validate = app.helper.validate;

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
        postalCode: app.helper.filterDigitsOnly(self.postalCode()),
        phone: app.helper.filterDigitsOnly(self.phone()),
        creditCard: app.helper.filterDigitsOnly(self.creditCard()),
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

  const cart = app.helper.getDefaults('cart');

  self.items = cart.items;
  self.totals = cart.totals;
}

(function initApp() {
  const dependenciesLoaded = typeof ko !== 'undefined';

  if (dependenciesLoaded) {
    window.app = window.app || {};
    app.applyBindings();
    app.checkout = new CheckoutVM();
    app.cart = new CartVM();

    ko.applyBindings(app);
  } else {
    setTimeout(initApp, 10);
  }
})();
