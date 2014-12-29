/**  @jsx React.DOM */
React = require('react'),
  _ = require('lodash');

var Controls = React.createClass({
  propTypes: {
    schema: React.PropTypes.object,
    getData: React.PropTypes.func,
    fetchList: React.PropTypes.func
  },

  getInitialState: function () {
    return {groupBy : '', totalBy : '', path: '', filterFields: 1};
  },

  render: function () {
    var that = this;
    if (this.state.groupBy && this.state.totalBy) {
      this.props.fetchList({
        path: this.state.path,
        groupBy: this.state.groupBy,
        filterBy: this.state.filterBy,
        filterByValue: this.state.filterByValue,
        totalBy: this.state.totalBy
      });
    }

    return (<div className="bg-info form form-inline">
      <form className="form form-inline" role="form">
        <div className="form-group col-md-12 bg-info">
          <label for="businessObject" className="col-md-2 business-object-label">Business Object: </label>
          <select onChange={this.handleResourceChange} id="businessObject"
              className="form-control col-md-10 business-object">
            <option value=""></option>
            {this.props.schema && _.map(this.props.schema.resources, function (value, key) {
              return <option value={key}>{key}</option>;
            })}
          </select>
        </div>
      </form>
    {_.times(this.state.filterFields, function (i) {

      return <form className="form form-inline" role="form">
        <div className="form-group col-md-12 bg-info">
          <label for="filterBy" className="col-md-2">Filter By Field: </label>
          <select onChange={that.handleFilterbyChange} id={"filterBy" + i}
              className="form-control col-md-10 filter-by">
            <option value=""></option>
          {_.map(that.state && that.state.fields, function (value, key) {
              return <option value={key}>{value.title}</option>;
            })}
          </select>
          <input type="text" className="form-control" id={"filterBy" + i}
            onChange={that.handleFilterbyValueChange} />
          <button type="button" className="btn btn-primary"
              style={i + 1 !== that.state.filterFields ? {display:"none"} : {}}
              onClick={that.addFilterField}>
            <span className="glyphicon glyphicon-plus"></span>
          </button>
        </div>
      </form>
    })}
      <form className="form form-inline" role="form">
        <div className="form-group col-md-12 bg-info">
          <label for="groupBy" className="col-md-2">Group By Field: </label>
          <select onChange={this.handleGroupbyChange} id="groupBy"
              className="form-control col-md-10 group-by">
            <option value=""></option>
            {_.map(this.state && this.state.fields, function (value, key) {
              return <option value={key}>{value.title}</option>;
            })}
          </select>
        </div>
      </form>
      <form className="form form-inline" role="form">
        <div className="form-group col-md-12 bg-info">
          <label for="totalBy" className="col-md-2">Total By Field: </label>
          <select onChange={this.handleTotalbyChange} id="totalBy"
              className="form-control col-md-10 total-by">
            <option value=""></option>
            <option value="_count">Count</option>
            {_.map(this.state && _.omit(this.state.fields, function (value) {
              return value.type !== "number";
            }), function (value, key) {
              return <option value={key}>{value.title}</option>;
            })}
          </select>
        </div>
      </form>
    </div>);
  },

  addFilterField: function (event) {
    this.setState({filterFields: this.state.filterFields + 1});
  },

  handleResourceChange: function (event) {
    var recordType = event.target.value;
    this.setState({
      recordType: recordType,
      path: this.props.schema.resources[recordType].methods.get.path,
      fields: this.props.schema.schemas[recordType].properties
    });
  },

  handleGroupbyChange: function (event) {
    var fieldName = event.target.value;
    this.setState({
      groupBy: fieldName
    });
  },

  handleFilterbyChange: function (event) {
    var index = Number(event.target.id.replace("filterBy", ""));
    var fieldName = event.target.value;
    this.setState({
      filterBy: fieldName
    });
  },

  handleFilterbyValueChange: function (event) {
    var fieldName = event.target.value;
    this.setState({
      filterByValue: fieldName
    });
  },

  handleTotalbyChange: function (event) {
    var fieldName = event.target.value;
    this.setState({
      totalBy: fieldName
    });
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    var that = this;
    var relevantFields = ["groupBy", "totalBy", "recordType", "filterFields", "filterBy", "filterByValue"];
    var fieldUpdate = false;
    _.each(relevantFields, function (field) {
      if(that.state[field] !== nextState[field]) {
        fieldUpdate = true;
      }
    });
    return !this.props.schema || fieldUpdate;
  }
});

module.exports = Controls;
