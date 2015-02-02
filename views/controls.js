/**  @jsx React.DOM */
"use strict";

var React = require('react'),
  _ = require('lodash');

/**
  The form to determine the definition of the chart. Consists of
  -Object name
  -Filter field(s) with their filter value(s)
  -Group-by field
  -Total-by field
  -Chart type
  -Descriptive title
*/
var Controls = React.createClass({
  propTypes: {
    definition: React.PropTypes.object,
    schema: React.PropTypes.object,
    setDefinition: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      definition: {},
      schema: {},
      setDefinition: null
    };
  },

  getInitialState: function () {
    return {
      // filterFields is the count of filter fields that we're currently displaying
      // TODO: don't count empty array elements as worthy
      filterFields: this.props.definition.filterByArray.length || 1,
    };
  },

  render: function () {
    let resources = _.map(this.props.schema.resources, (value, key) => {
      return <option value={key} key={key}>{key}</option>;
    });

    let recordType = this.props.definition.recordType;
    let resourceFields = recordType && this.props.schema.schemas[recordType].properties;
    let fields = _.map(resourceFields, (value, key) => {
      return <option value={key} key={key}>{value.title}</option>;
    });

    let totals = _.map(_.omit(resourceFields, value => {
      return value.type !== "number";
    }), (value, key) => {
      return <option value={key} key={key}>{value.title}</option>;
    });

    return (
      <form className="form-horizontal" role="form">
        <div className="form-group">
          <label for="businessObject" ref="businessObjectLabel" className="col-md-5 control-label">Business Object:</label>
          <div className="col-md-7">
            <select onChange={this.handleResourceChange}
                id="businessObject"
                ref="businessObject"
                value={this.props.definition.recordType}
                className="form-control">
              <option value=""></option>
              {resources}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="col-md-5 control-label">Filter by Fields:</label>
        </div>

    {_.times(this.state.filterFields, i => {
      return (<div className="form-group" key={"formGroup" + i}>
        <div className="col-md-5">
          <select onChange={this.handleFilterbyChange} id={"filterBy" + i} ref={"filterBy" + i}
              key={"filterBy" + i} className="form-control"
              value={this.props.definition.filterByArray.length > i &&
                this.props.definition.filterByArray[i]}>
            <option value=""></option>
            {fields}
          </select>
        </div>
        <div className="col-md-5">
          <input type="text" className="form-control" id={"filterByValue" + i}
            ref={"filterByValue" + i} key={"filterByValue" + i}
            value={this.props.definition.filterByValueArray &&
              this.props.definition.filterByValueArray.length > i &&
              this.props.definition.filterByValueArray[i]}
            onChange={this.handleFilterbyValueChange} />
        </div>
        <div className="col-md-2">
          <button type="button" className="btn btn-info"
              style={i + 1 !== this.state.filterFields ? {display:"none"} : {}}
              onClick={this.addFilterField}>
            <span className="glyphicon glyphicon-plus"></span>
          </button>
        </div>
      </div>);
    })}
        <div className="form-group">
          <label for="groupBy" className="col-md-5 control-label">Group By Field:</label>
          <div className="col-md-7">
            <select onChange={this.handleGroupbyChange} ref="groupBy" id="groupBy"
                value={this.props.definition.groupBy}
                className="form-control">
              <option value=""></option>
              {fields}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label for="totalBy" className="col-md-5 control-label">Total By Field: </label>
          <div className="col-md-7">
            <select onChange={this.handleTotalbyChange} ref="totalBy" id="totalBy"
                value={this.props.definition.totalBy}
                className="form-control">
              <option value=""></option>
              <option value="_count">Count</option>
              {totals}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label for="chartType" className="col-md-5 control-label">Chart Type: </label>
          <div className="col-md-7">
            <select onChange={this.handleChartTypeChange}
                ref="chartType"
                id="chartType"
                value={this.props.definition.chartType}
                className="form-control">
              <option value="bar">Bar</option>
              <option value="donut">Donut</option>
              <option value="pie">Pie</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label for="chartType" className="col-md-5 control-label">Description: </label>
          <div className="col-md-7">
            <input onChange={this.handleDescriptionChange}
                ref="description"
                id="description"
                value={this.props.definition.description}
                className="form-control" />
          </div>
        </div>
      </form>
    );
  },

  addFilterField: function (event) {
    this.setState({filterFields: this.state.filterFields + 1});
  },

  /**
    When we change the record type we want to reset the majority of the form
    because the fields are no longer relevant to the new object.
  */
  handleResourceChange: function (event) {
    let recordType = event.target.value;
    this.props.setDefinition({
      recordType,
      groupBy: null,
      totalBy: null,
      filterByArray: [],
      filterByValuesArray: []
    });
    this.setState({
      filterFields: 1,
    });
    this.refs.filterBy0.getDOMNode().value = "";
    this.refs.filterByValue0.getDOMNode().value = "";
    this.refs.groupBy.getDOMNode().value = "";
    this.refs.totalBy.getDOMNode().value = "";
  },

  /**
    These all shout the change up to the parent
  */
  handleChartTypeChange: function (event) {
    this.props.setDefinition({chartType: event.target.value});
  },

  handleDescriptionChange: function (event) {
    this.props.setDefinition({description: event.target.value});
  },

  handleGroupbyChange: function (event) {
    this.props.setDefinition({groupBy: event.target.value});
  },

  handleFilterbyChange: function (event) {
    let fieldName = event.target.value;
    let index = Number(event.target.id.replace("filterBy", ""));
    let filterByArray = _.clone(this.props.definition.filterByArray);
    filterByArray[index] = fieldName;
    this.props.setDefinition({filterByArray});
  },

  handleFilterbyValueChange: function (event) {
    let fieldName = event.target.value;
    let index = Number(event.target.id.replace("filterByValue", ""));
    let filterByValueArray = _.clone(this.props.definition.filterByValueArray);
    filterByValueArray[index] = fieldName;
    this.props.setDefinition({filterByValueArray});
  },

  handleTotalbyChange: function (event) {
    this.props.setDefinition({totalBy: event.target.value});
  }

});

module.exports = Controls;
