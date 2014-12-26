/** @jsx React.DOM */

var _ = require("lodash");

// __tests__/control-test.js
jest.dontMock('../views/controls');

describe('dashboard control', function() {
  it('renders appropriately', function() {
    var React = require('react/addons');
    var Controls = require('../views/controls.js');
    var TestUtils = React.addons.TestUtils;

    var schema = {
      resources: {
        foo: "bar",
        baz: "Qux"
      }
    };
    var getData = _.noop;
    var fetchList = function (options) {
      console.log("fetch list", options);
    };

    // Render a control in the document
    var controls = TestUtils.renderIntoDocument(
      <Controls schema={schema} getData={getData} fetchList={fetchList} />
    );

    // Verify that it's Off by default
    var label = TestUtils.findRenderedDOMComponentWithClass(controls, 'business-object-label');
    expect(label.getDOMNode().textContent).toEqual('Business Object: ');

    //var businessObjectDropdown =
    //  TestUtils.findRenderedDOMComponentWithClass(controls, 'business-object');
    //console.log("debug", businessObjectDropdown.getDOMNode().length,
    //  businessObjectDropdown.getDOMNode().textContent);

    //TestUtils.Simulate.keyDown(businessObjectDropdown, {key: "f"});
    //expect(label.getDOMNode().textContent).toEqual('On');
  });
});
