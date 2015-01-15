"use strict";
var moment = require("moment");

module.exports = function (input) {
  // capture a leading >, >=, <, or <=
  var operator = input.match(/^[<>]=|^[<>]/);
  var value = operator ? input.substring(operator[0].length).trim() : input;

  // the value is in form +0 or -0 or +10 or -1342
  // i.e. a plus or minus, followed by a number
  // note the departure from xTuple convention: "0" is interpreted
  // as not being a date-offset. That's because the filter field is
  // general purpose and not just a date widget. For many types,
  // 0 should just mean 0.
  if(/^[+-]\d+$/.test(value)) {
    value = moment().add(Number(value), "days").format();
  }

  return {
    operator: operator ? operator[0] : "EQUALS",
    value: value
  };

};
