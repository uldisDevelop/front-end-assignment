window.app = window.app || {};

app.applyBindings = () => {
  ko.extenders.text = function (target, max) {
    const result = ko
      .pureComputed({
        read: target,
        write: function (newValue) {
          const current = target();

          const hasOnlyDigits =
            newValue.match(/^[a-z]+$/i) || newValue.match(/^$/g);

          const lengthIsValid = newValue.length <= max;

          const valueToWrite =
            lengthIsValid && hasOnlyDigits ? newValue : current;

          if (valueToWrite !== current) {
            target(valueToWrite);
          } else if (newValue !== current) {
            target.notifySubscribers(valueToWrite);
          }
        },
      })
      .extend({ notify: 'always' });

    result(target());
    return result;
  };
  ko.extenders.email = function (target, max) {
    const result = ko
      .pureComputed({
        read: target,
        write: function (newValue) {
          const current = target();

          const match =
            newValue.match(/^[a-z,.-@]+$/i) || newValue.match(/^$/g);

          const lengthIsValid = newValue.length <= max;

          const valueToWrite =
            lengthIsValid && match ? newValue : current;

          if (valueToWrite !== current) {
            target(valueToWrite);
          } else if (newValue !== current) {
            target.notifySubscribers(valueToWrite);
          }
        },
      })
      .extend({ notify: 'always' });

    result(target());
    return result;
  };
  ko.extenders.numeric = function (target, max) {
    const result = ko
      .pureComputed({
        read: target,
        write: function (newValue) {
          const current = target();

          const hasOnlyDigits =
            newValue.match(/^[0-9]+$/g) || newValue.match(/^$/g);

          const lengthIsValid = newValue.length <= max;

          const valueToWrite =
            lengthIsValid && hasOnlyDigits ? newValue : current;

          if (valueToWrite !== current) {
            target(valueToWrite);
          } else if (newValue !== current) {
            target.notifySubscribers(valueToWrite);
          }
        },
      })
      .extend({ notify: 'always' });

    result(target());
    return result;
  };
  ko.extenders.phone = function (target, max) {
    const result = ko
      .pureComputed({
        read: target,
        write: function (newValue) {
          const current = target();

          const allowedCharacters = '1234567890()-— ';

          let phraseIsValid = true;

          for (var j = 0; j < newValue.length; j++) {
            let letterIsValid = false;
            for (var i = 0; i < allowedCharacters.length; i++) {
              if (newValue[j] === allowedCharacters[i]) {
                letterIsValid = true;
              }
            }

            if (!letterIsValid) {
              phraseIsValid = false;
            }
          }
          const lengthIsValid =
            app.helper.filterDigitsOnly(newValue).length <= max;

          const valueToWrite =
            phraseIsValid && lengthIsValid ? newValue : current;

          if (valueToWrite !== current) {
            target(valueToWrite);
          } else if (newValue !== current) {
            target.notifySubscribers(valueToWrite);
          }
        },
      })
      .extend({ notify: 'always' });

    result(target());
    return result;
  };

  ko.extenders.creditCard = function (target) {
    const result = ko
      .pureComputed({
        read: target,
        write: function (newValue) {
          let _newValue = newValue.replaceAll(' ', '').replaceAll('—', '-');
          const current = target();

          const allowedCharacters = '1234567890-—';
          const mask = '0000-0000-0000-0000';

          let phraseIsValid = true;
          for (var j = 0; j < _newValue.length; j++) {
            let letterIsValid = false;
            for (var i = 0; i < allowedCharacters.length; i++) {
              if (_newValue[j] === allowedCharacters[i]) {
                letterIsValid = true;
              }
            }

            if (!letterIsValid) {
              phraseIsValid = false;
            }
          }

          const valueIsGrowing = _newValue.length > current.length;
          const addedLastChar =
            valueIsGrowing && _newValue.slice(0, -1) === current;

          if (phraseIsValid && valueIsGrowing && addedLastChar) {
            for (var j = 0; j < _newValue.length; j++) {
              let letterIsValid = false;
              const letter = _newValue[j];
              if (j <= mask.length - 1) {
                const digit = mask[j] === '0';
                if (digit && isNumeric(letter)) {
                  letterIsValid = true;
                } else if (!digit && letter === '-') {
                  letterIsValid = true;
                }
              }

              if (!letterIsValid) {
                phraseIsValid = false;
              }
            }

            if (phraseIsValid && [4, 9, 14].includes(_newValue.length)) {
              _newValue = _newValue + '-';
            }
          }

          const lengthIsValid = _newValue.length <= 25;

          const valueToWrite =
            phraseIsValid && lengthIsValid ? _newValue : current;
          if (valueToWrite !== current) {
            target(valueToWrite);
          } else if (_newValue !== current) {
            target.notifySubscribers(valueToWrite);
          }
        },
      })
      .extend({ notify: 'always' });

    result(target());
    return result;
  };

  ko.extenders.creditCardExp = function (target) {
    const result = ko
      .pureComputed({
        read: target,
        write: function (newValue) {
          let _newValue = newValue.replaceAll(' ', '').replaceAll('—', '-');
          const current = target();

          const allowedCharacters = '1234567890/';
          const mask = '00-00';

          let phraseIsValid = true;
          for (var j = 0; j < _newValue.length; j++) {
            let letterIsValid = false;
            for (var i = 0; i < allowedCharacters.length; i++) {
              if (_newValue[j] === allowedCharacters[i]) {
                letterIsValid = true;
              }
            }

            if (!letterIsValid) {
              phraseIsValid = false;
            }
          }

          const valueIsGrowing = _newValue.length > current.length;
          const addedLastChar =
            valueIsGrowing && _newValue.slice(0, -1) === current;

          if (phraseIsValid && valueIsGrowing && addedLastChar) {
            for (var j = 0; j < _newValue.length; j++) {
              let letterIsValid = false;
              const letter = _newValue[j];
              if (j <= mask.length - 1) {
                const digit = mask[j] === '0';
                if (digit && isNumeric(letter)) {
                  letterIsValid = true;
                } else if (!digit && letter === '/') {
                  letterIsValid = true;
                }
              }

              if (!letterIsValid) {
                phraseIsValid = false;
              }
            }

            if (phraseIsValid && [2].includes(_newValue.length)) {
              _newValue = _newValue + '/';
            }
          }

          const lengthIsValid = _newValue.length <= 5;

          const valueToWrite =
            phraseIsValid && lengthIsValid ? _newValue : current;
          if (valueToWrite !== current) {
            target(valueToWrite);
          } else if (_newValue !== current) {
            target.notifySubscribers(valueToWrite);
          }
        },
      })
      .extend({ notify: 'always' });

    result(target());
    return result;
  };
};
function isNumeric(str) {
  return /^\d+$/.test(str);
}
