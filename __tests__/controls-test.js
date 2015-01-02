/** @jsx React.DOM */

var _ = require("lodash");

// __tests__/control-test.js
jest.dontMock('../views/controls');
jest.dontMock('lodash');

describe('Test Chart Controls', function () {
  var props;
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
      fetchData: _.noop
    };
    spyOn(props, "fetchData");
  });

  it('Ensure component can be rendered with correct properties', function () {
    // Render a control in the document
    var controls = TestUtils.renderIntoDocument(
      <Controls schema={props.schema} getData={_.noop} fetchData={props.fetchData} />
    );

    // Verify controls are rendered
    expect(controls).toBeDefined();
    // Verify props
    expect(controls.props.schema).toBe(props.schema);

    var label = controls.refs.businessObjectLabel.getDOMNode();
    expect(label.textContent).toEqual('Business Object:');

    var businessObjectDropdown = controls.refs.businessObject.getDOMNode();
    TestUtils.Simulate.change(businessObjectDropdown, {target: {value: "Foo"}});

    var groupbyDropdown = controls.refs.groupBy.getDOMNode();
    TestUtils.Simulate.change(groupbyDropdown, {target: {value: "propA"}});

    var totalbyDropdown = controls.refs.totalBy.getDOMNode();
    TestUtils.Simulate.change(totalbyDropdown, {target: {value: "_count"}});

    expect(props.fetchData).toHaveBeenCalledWith(expectedFetch);
  });
});
