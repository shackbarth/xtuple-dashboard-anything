/** @jsx React.DOM */

"use strict";

var _ = require("lodash");

// __tests__/control-test.js
jest.dontMock('../views/controls');
jest.dontMock('lodash');

describe('Test Chart Controls', function () {
  var props, definition;
  var React = require('react/addons');
  var Controls = require('../views/controls.js');
  var TestUtils = React.addons.TestUtils;
  var expectedCallback1 = {
    recordType : 'Foo',
    groupBy : null,
    totalBy : null,
    filterByArray : [  ],
    filterByValuesArray : [  ]
  };
  var expectedCallback2 = {
    groupBy : 'propA'
  };
  var expectedCallback3 = {
    totalBy : '_count'
  };

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
      setDefinition: _.noop,
      definition: {
        filterByArray: [],
        filterByValuesArray: []
      }
    };
    spyOn(props, "setDefinition");
  });

  it('Ensure component can be rendered with correct properties', function () {
    // Render a control in the document
    var controls = TestUtils.renderIntoDocument(
      <Controls schema={props.schema} definition={props.definition} setDefinition={props.setDefinition} />
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

    expect(props.setDefinition).toHaveBeenCalledWith(expectedCallback1);
    expect(props.setDefinition).toHaveBeenCalledWith(expectedCallback2);
    expect(props.setDefinition).toHaveBeenCalledWith(expectedCallback3);
  });
});
