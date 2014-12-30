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
    return {
      groupBy : '',
      totalBy : '',
      path: '',
      filterFields: 1,
      filterByArray: [],
      filterByValueArray: []
    };
  },

  render: function () {
    var that = this;
    if (this.state.groupBy && this.state.totalBy) {
      this.props.fetchList({
        path: this.state.path,
        groupBy: this.state.groupBy,
        filterByArray: this.state.filterByArray,
        filterByValueArray: this.state.filterByValueArray,
        totalBy: this.state.totalBy
      });
    }

    return (
      <form className="form-horizontal" role="form">
        <div className="form-group">
          <label for="businessObject" className="col-md-2 control-label">Business Object: </label>
          <div className="col-md-3">
            <select onChange={this.handleResourceChange} id="businessObject"
                className="form-control">
              <option value=""></option>
              {this.props.schema && _.map(this.props.schema.resources, function (value, key) {
                return <option value={key}>{key}</option>;
              })}
            </select>
          </div>
        </div>
    {_.times(this.state.filterFields, function (i) {

      return <div className="form-group">
        <label for="filterBy" className="col-md-2 control-label">Filter By Field: </label>
        <div className="col-md-2">
          <select onChange={that.handleFilterbyChange} id={"filterBy" + i}
              className="form-control">
            <option value=""></option>
          {_.map(that.state && that.state.fields, function (value, key) {
              return <option value={key}>{value.title}</option>;
            })}
          </select>
        </div>
        <div className="col-md-2">
          <input type="text" className="form-control" id={"filterByValue" + i}
            onChange={that.handleFilterbyValueChange} />
        </div>
        <button type="button" className="btn btn-info"
            style={i + 1 !== that.state.filterFields ? {display:"none"} : {}}
            onClick={that.addFilterField}>
          <span className="glyphicon glyphicon-plus"></span>
        </button>
      </div>
    })}
        <div className="form-group">
          <label for="groupBy" className="col-md-2 control-label">Group By Field: </label>
          <div className="col-md-2">
            <select onChange={this.handleGroupbyChange} id="groupBy"
                className="form-control">
              <option value=""></option>
              {_.map(this.state && this.state.fields, function (value, key) {
                return <option value={key}>{value.title}</option>;
              })}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label for="totalBy" className="col-md-2 control-label">Total By Field: </label>
          <div className="col-md-2">
            <select onChange={this.handleTotalbyChange} id="totalBy"
                className="form-control">
              <option value=""></option>
              <option value="_count">Count</option>
              {_.map(this.state && _.omit(this.state.fields, function (value) {
                return value.type !== "number";
              }), function (value, key) {
                return <option value={key}>{value.title}</option>;
              })}
            </select>
          </div>
        </div>
      </form>
    );
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
    var fieldName = event.target.value;
    var index = Number(event.target.id.replace("filterBy", ""));
    var filterByArray = _.clone(this.state.filterByArray);
    filterByArray[index] = fieldName;
    this.setState({
      filterByArray: filterByArray
    });
  },

  handleFilterbyValueChange: function (event) {
    var fieldName = event.target.value;
    var index = Number(event.target.id.replace("filterByValue", ""));
    var filterByValueArray = _.clone(this.state.filterByValueArray);
    filterByValueArray[index] = fieldName;
    this.setState({
      filterByValueArray: filterByValueArray
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
    var relevantFields = ["groupBy", "totalBy", "recordType", "filterFields",
      "filterByArray", "filterByValueArray"];
    var fieldUpdate = false;
    _.each(relevantFields, function (field) {
      if(!_.isEqual(that.state[field], nextState[field])) {
        fieldUpdate = true;
      }
    });
    return !this.props.schema || fieldUpdate;
  }
});

module.exports = Controls;
