"use strict";
var moment = require("moment");

var operatorMap = {
  ">": "GREATER_THAN",
  ">=": "AT_LEAST",
  "<": "LESS_THAN",
  "<=": "AT_MOST"
};

/**
  Quick implementation to understand different operators and relative dates.
  See the test file for use-cases.
*/
module.exports = function (input) {
  // capture a leading >, >=, <, or <=
  var operator = input.match(/^[<>]=|^[<>]/);
  var value = operator ? input.substring(operator[0].length).trim() : input;
  operator = operator ? operatorMap[operator[0]] : "EQUALS";

  // the value is in form +0 or -0 or +10 or -1342
  // i.e. a plus or minus, followed by a number
  // note the departure from xTuple convention: "0" is interpreted
  // as not being a date-offset. That's because the filter field is
  // general purpose and not just a date widget. For many types,
  // 0 should just mean 0.
  //
  // The "correct" way to get this right is to pass in the type of the field.
  ///
  if(/^[+-]\d+$/.test(value)) {
    value = moment().add(Number(value), "days").format();
  }

  return {
    operator: operator,
    value: value
  };

};
