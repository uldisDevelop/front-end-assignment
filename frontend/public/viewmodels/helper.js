window.app = window.app || {};

app.helper = {
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
  validate: (value, tag) => {
    if (tag === 'required') {
      return value.trim() === '';
    } else {
      const valueFormatted = value.trim().toLowerCase();

      if (tag === 'creditCard') {
        return !valueFormatted
          .replaceAll('-', '')
          .replaceAll('—', '')
          .replaceAll(' ', '')
          .match(app.helper.regex[tag]);
      }
      if (tag === 'phone') {
        return app.helper.filterDigitsOnly(value).length !== 9;
      }
      if (
        app.helper.regex[tag] &&
        !!valueFormatted.match(app.helper.regex[tag])
      ) {
        return false;
      }
      return true;
    }
  },
};
