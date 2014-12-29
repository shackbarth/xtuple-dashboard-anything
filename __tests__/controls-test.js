/** @jsx React.DOM */

var _ = require("lodash");

// __tests__/control-test.js
jest.dontMock('../views/controls');
jest.dontMock('lodash');

describe('dashboard control', function() {
  var props;

  beforeEach(function () {
    props = {
      schema: {
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
      },
      fetchList: _.noop
    };
    spyOn(props, "fetchList");

  });

  it('captures user input and fetches data appropriately', function() {
    var React = require('react/addons');
    var Controls = require('../views/controls.js');
    var TestUtils = React.addons.TestUtils;
    var expectedFetch = {
      path: 'foo-get',
      groupBy: 'propA',
      filterByArray: [],
      filterByValueArray: [],
      totalBy: '_count'
    };

    // Render a control in the document
    var controls = TestUtils.renderIntoDocument(
      <Controls schema={props.schema} getData={_.noop} fetchList={props.fetchList} />
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

    expect(props.fetchList).toHaveBeenCalledWith(expectedFetch);

  });
});
