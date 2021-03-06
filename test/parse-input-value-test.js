"use strict";

var parser = require("../util/parse-input-value");
var assert = require("chai").assert;

describe("parser", function () {
  it("should default to equals", function () {
    assert.deepEqual(parser("Foo"), {
      operator: "EQUALS",
      value: "Foo"
    });
  });

  it("should understand >=", function () {
    assert.deepEqual(parser(">= Foo"), {
      operator: "AT_LEAST",
      value: "Foo"
    });
  });

  it("should understand >", function () {
    assert.deepEqual(parser("> Foo"), {
      operator: "GREATER_THAN",
      value: "Foo"
    });
  });

  it("should understand <=", function () {
    assert.deepEqual(parser("<= Foo"), {
      operator: "AT_MOST",
      value: "Foo"
    });
  });

  it("should understand <", function () {
    assert.deepEqual(parser("< Foo"), {
      operator: "LESS_THAN",
      value: "Foo"
    });
  });

  it("should parse dates", function () {
    var parsed = parser("<= +0");
    assert.equal(parsed.operator, "AT_MOST");
    var confirmValidDate = new Date(parsed.value);
    var invalidDate = new Date("foo");
    assert.notDeepEqual(confirmValidDate, invalidDate);
  });

});
