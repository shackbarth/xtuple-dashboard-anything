/**  @jsx React.DOM */
React = require('react'),
  _ = require('lodash');

var Controls = React.createClass({
  propTypes: {
    schema: React.PropTypes.object,
    getData: React.PropTypes.func,
    fetchList: React.PropTypes.func
  },

  getDefaultProps: function () {
    return {
      schema: {
        resources: {}
      },
      getData: null,
      fetchList: null
    };
  },

  getInitialState: function () {
    return {
      groupBy : '',
      totalBy : '',
      path: '',
      fields: {},
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

    var resources = _.map(this.props.schema.resources, function (value, key) {
      return <option value={key} key={key}>{key}</option>;
    });

    var fields = _.map(this.state.fields, function (value, key) {
      return <option value={key} key={key}>{value.title}</option>;
    });

    var totals = _.map(_.omit(fields, function (value) {
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

      return <div className="form-group">
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
      </div>
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

  shouldComponentUpdate: function (nextProps, nextState) {
    var that = this;
    var relevantFields = ["groupBy", "totalBy", "recordType", "filterFields",
      "filterByArray", "filterByValueArray"];
    var fieldUpdate = false;
    _.each(relevantFields, function (field) {
      if (!_.isEqual(that.state[field], nextState[field])) {
        fieldUpdate = true;
      }
    });
    return !this.props.schema || fieldUpdate;
  }
});

module.exports = Controls;
