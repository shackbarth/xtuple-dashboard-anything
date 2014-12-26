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
        Foo: {
          methods: {
            get: {
              path: "foo-get"
            }
          }
        }
      },
      schemas: {
        Foo: {
          properties: {
            propA: {
              title: "Prop A"
            },
            propB: {
              title: "Prop B"
            }
          }
        }
      }
    };
    var fetchList = function (options) {
      expect(options.path).toEqual("foo-get");
      // on jasmine 1.3 with no done() this isn't very reliable
      console.log("now we're done");
    };

    // Render a control in the document
    var controls = TestUtils.renderIntoDocument(
      <Controls schema={schema} getData={_.noop} fetchList={fetchList} />
    );

    var label = TestUtils.findRenderedDOMComponentWithClass(controls, 'business-object-label');
    expect(label.getDOMNode().textContent).toEqual('Business Object: ');

    var businessObjectDropdown =
      TestUtils.findRenderedDOMComponentWithClass(controls, 'business-object');
    TestUtils.Simulate.change(businessObjectDropdown, {target: {value: "Foo"}});

    var groupbyDropdown =
      TestUtils.findRenderedDOMComponentWithClass(controls, 'group-by');
    TestUtils.Simulate.change(groupbyDropdown, {target: {value: "propA"}});

    var totalbyDropdown =
      TestUtils.findRenderedDOMComponentWithClass(controls, 'total-by');
    TestUtils.Simulate.change(totalbyDropdown, {target: {value: "_count"}});
  });
});
