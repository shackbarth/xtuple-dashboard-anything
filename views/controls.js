/**  @jsx React.DOM */
"use strict";

var React = require('react'),
  _ = require('lodash');

var Controls = React.createClass({
  propTypes: {
    query: React.PropTypes.object,
    schema: React.PropTypes.object,
    setChartType: React.PropTypes.func,
    setQuery: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      query: {},
      schema: {},
      setChartType: null,
      setQuery: null
    };
  },

  getInitialState: function () {
    return {
      filterFields: 1,
      /*
      groupBy : '',
      totalBy : '',
      path: '',
      fields: {},
      filterByArray: [],
      filterByValueArray: []
      */
    };
  },

  render: function () {
    var that = this;
    var resources = _.map(this.props.schema.resources, function (value, key) {
      return <option value={key} key={key}>{key}</option>;
    });

    var recordType = this.props.query.recordType;
    var resourceFields = recordType && this.props.schema.schemas[recordType].properties;
    var fields = _.map(resourceFields, function (value, key) {
      return <option value={key} key={key}>{value.title}</option>;
    });

    var totals = _.map(_.omit(resourceFields, function (value) {
      return value.type !== "number";
    }), function (value, key) {
      return <option value={key} key={key}>{value.title}</option>;
    });

    return (
      <form className="form-horizontal" role="form">
        <div className="form-group">
          <label for="businessObject" ref="businessObjectLabel" className="col-md-2 control-label">Business Object:</label>
          <div className="col-md-3">
            <select onChange={this.handleResourceChange} id="businessObject" ref="businessObject"
                className="form-control">
              <option value=""></option>
              {resources}
            </select>
          </div>
        </div>
    {_.times(this.state.filterFields, function (i) {

      return (<div className="form-group">
        <label for="filterBy" className="col-md-2 control-label">Filter By Field: </label>
        <div className="col-md-2">
          <select onChange={that.handleFilterbyChange} id={"filterBy" + i} ref={"filterBy" + i}
              className="form-control">
            <option value=""></option>
            {fields}
          </select>
        </div>
        <div className="col-md-2">
          <input type="text" className="form-control" id={"filterByValue" + i} ref={"filterByValue" + i}
            onChange={that.handleFilterbyValueChange} />
        </div>
        <button type="button" className="btn btn-info"
            style={i + 1 !== that.state.filterFields ? {display:"none"} : {}}
            onClick={that.addFilterField}>
          <span className="glyphicon glyphicon-plus"></span>
        </button>
      </div>);
    })}
        <div className="form-group">
          <label for="groupBy" className="col-md-2 control-label">Group By Field:</label>
          <div className="col-md-2">
            <select onChange={this.handleGroupbyChange} ref="groupBy" id="groupBy"
                className="form-control">
              <option value=""></option>
              {fields}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label for="totalBy" className="col-md-2 control-label">Total By Field: </label>
          <div className="col-md-2">
            <select onChange={this.handleTotalbyChange} ref="totalBy" id="totalBy"
                className="form-control">
              <option value=""></option>
              <option value="_count">Count</option>
              {totals}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label for="chartType" className="col-md-2 control-label">Chart Type: </label>
          <div className="col-md-2">
            <select onChange={this.handleChartTypeChange} ref="chartType" id="chartType"
                className="form-control">
              <option value="bar">Bar</option>
              <option value="donut">Donut</option>
              <option value="pie">Pie</option>
              {totals}
            </select>
          </div>
        </div>
      </form>
    );
  },

  addFilterField: function (event) {
    this.setState({filterFields: this.state.filterFields + 1});
  },

  setParentQuery: function (override) {
    this.props.setQuery(override);
  /*  _.extend({
      path: this.state.path,
      groupBy: this.state.groupBy,
      filterByArray: this.state.filterByArray,
      filterByValueArray: this.state.filterByValueArray,
      totalBy: this.state.totalBy
    }, override));
    */
  },

  handleResourceChange: function (event) {
    var recordType = event.target.value;
    this.setParentQuery({recordType: recordType});
    /*
    this.setState({
      recordType: recordType,
      path: this.props.schema.resources[recordType].methods.get.path,
      fields: this.props.schema.schemas[recordType].properties,
      // reset everything else
      groupBy : '',
      totalBy : '',
      filterFields: 1,
      filterByArray: [],
      filterByValueArray: []
    });
    this.refs.filterBy0.getDOMNode().value = "";
    this.refs.filterByValue0.getDOMNode().value = "";
    this.refs.groupBy.getDOMNode().value = "";
    this.refs.totalBy.getDOMNode().value = "";
    */
  },

  handleChartTypeChange: function (event) {
    var fieldName = event.target.value;
    //this.setState({
    //  chartType: fieldName
    //});
    this.props.setChartType(fieldName);
  },

  handleGroupbyChange: function (event) {
    var fieldName = event.target.value;
    //this.setState({
    //  groupBy: fieldName
    //});

    this.setParentQuery({groupBy: fieldName});
  },

  handleFilterbyChange: function (event) {
    var fieldName = event.target.value;
    var index = Number(event.target.id.replace("filterBy", ""));
    var filterByArray = _.clone(this.props.query.filterByArray);
    filterByArray[index] = fieldName;
    //this.setState({
    //  filterByArray: filterByArray
    //});

    this.setParentQuery({filterByArray: filterByArray});
  },

  handleFilterbyValueChange: function (event) {
    var fieldName = event.target.value;
    var index = Number(event.target.id.replace("filterByValue", ""));
    var filterByValueArray = _.clone(this.props.query.filterByValueArray);
    filterByValueArray[index] = fieldName;
    //this.setState({
    //  filterByValueArray: filterByValueArray
    //});

    this.setParentQuery({filterByValueArray: filterByValueArray});
  },

  handleTotalbyChange: function (event) {
    var fieldName = event.target.value;
    //this.setState({
    //  totalBy: fieldName
    //});

    this.setParentQuery({totalBy: fieldName});
  }

});

module.exports = Controls;
