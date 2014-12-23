/**  @jsx React.DOM */
React = require('react'),
  _ = require('lodash');

var once = false;

var Controls = React.createClass({
  propTypes: {
    schema: React.PropTypes.object,
    getData: React.PropTypes.func,
    fetchList: React.PropTypes.func
  },

  getInitialState: function () {
    return {groupBy : '', totalBy : '', path: ''};
  },

  render: function () {
    if (this.state.groupBy && this.state.totalBy && !once) {
      once = true;
      this.props.fetchList({
        path: this.state.path,
        groupBy: this.state.groupBy,
        filterBy: this.state.filterBy,
        filterByValue: this.state.filterByValue,
        totalBy: this.state.totalBy
      });
    }

    return (
      <div className="bg-primary form form-inline">
        <form className="form form-inline" role="form">
          <div className="form-group col-md-12 bg-primary">
            <label for="businessObject" className="col-md-2">Business Object: </label>
            <select onChange={this.handleResourceChange} id="businessObject" className="form-control col-md-10">
              <option value=""></option>
              {this.props.schema && _.map(this.props.schema.resources, function (value, key) {
                return <option value={key}>{key}</option>;
              })}
            </select>
          </div>
        </form>
        <form className="form form-inline" role="form">
          <div className="form-group col-md-12 bg-primary">
            <label for="filterBy" className="col-md-2">Filter By Field: </label>
            <select onChange={this.handleFilterbyChange} id="filterBy" className="form-control col-md-10">
              <option value=""></option>
              {_.map(this.state && this.state.fields, function (value, key) {
                return <option value={key}>{value.title}</option>;
              })}
            </select>
            <input type="text" className="form-control" onChange={this.handleFilterbyValueChange} />
          </div>
        </form>
        <form className="form form-inline" role="form">
          <div className="form-group col-md-12 bg-primary">
            <label for="groupBy" className="col-md-2">Group By Field: </label>
            <select onChange={this.handleGroupbyChange} id="groupBy" className="form-control col-md-10">
              <option value=""></option>
              {_.map(this.state && this.state.fields, function (value, key) {
                return <option value={key}>{value.title}</option>;
              })}
            </select>
          </div>
        </form>
        <form className="form form-inline" role="form">
          <div className="form-group col-md-12 bg-primary">
            <label for="totalBy" className="col-md-2">Total By Field: </label>
            <select onChange={this.handleTotalbyChange} id="totalBy" className="form-control col-md-10">
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
      </div>
    );
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

  // XXX TODO we'll want to allow for n filters
  handleFilterbyChange: function (event) {
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
  }
});

module.exports = Controls;
