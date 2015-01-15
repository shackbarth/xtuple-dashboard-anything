/**  @jsx React.DOM */
'use strict';

var defaultResults = [
  '{"chartType":"donut","filterByArray":["status"],"filterByValueArray":["R"],"recordType":"Incident","groupBy":"category","totalBy":"_count"}',
  '{"chartType":"bar","filterByArray":[],"filterByValueArray":[],"recordType":"Incident","groupBy":"status","totalBy":"_count"}',
  '{"chartType":"bar","filterByArray":[],"filterByValueArray":[],"recordType":"Incident","groupBy":"status","totalBy":"_count"}',
  '{"chartType":"bar","filterByArray":[],"filterByValueArray":[],"recordType":"Incident","groupBy":"status","totalBy":"_count"}',
];

var React = require('react'),
  $ = require('jquery'),
  _ = require('lodash'),
  Loader = require('react-loader'),
  Controls = require('./controls'),
  PieChart = require('./pie-chart'),
  DonutChart = require('./donut-chart'),
  BarChart = require('./bar-chart'),
  parseInputValue = require("../util/parse-input-value"),
  url = require('url'),
  org = url.parse(window.location.href).pathname.split('/')[1];

var ChartElement = React.createClass({
  propTypes: {
    position: React.PropTypes.number,
    loaded: React.PropTypes.bool,
    schema: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      data: [],
      showControls: false,
      definition: {
        chartType: 'bar',
        filterByArray: [],
        filterByValueArray: []
      }
    };
  },

  componentDidMount: function () {
    var that = this;

    this.fetchSavedDefinition(function (err, result) {
      if (err) {
        console.log("Error fetching saved query", err);
        return;
      }
      that.setState({definition: result.definition});
    });
  },

  // mockup until we get the route working
  fetchSavedDefinition: function (callback) {
    var that = this;

    $.ajax({
      url: '/' + org + '/browser-api/v1/services/user-preference/get-preference',
      type: "POST",
      dataType: "json",
      data: {
        attributes: [
          "DashboardAnythingQuery" + this.props.position
        ]
      },
      success: function (data) {
        var result = data.data.result.length ?
          JSON.parse(data.data.result[0].userpref_value) :
          JSON.parse(defaultResults[that.props.position]);
        callback(null, {definition: result});
      },
      error: function (err) {
        var result = JSON.parse(defaultResults[that.props.position]);
        callback(null, {definition: result});
      }
    });
  },

  render: function () {
    var chart;
    if(this.state.definition.chartType === "bar") {
      chart = <BarChart
        key={String(Math.random())} // XXX force re-render
        data={this.state.data}
        definition={this.state.definition}
        position={this.props.position}
      />;
    } else if(this.state.definition.chartType === "donut") {
      chart = <DonutChart
        key={String(Math.random())} // XXX force re-render
        data={this.state.data}
        definition={this.state.definition}
        position={this.props.position}
      />;
    } else {
      chart = <PieChart
        key={String(Math.random())} // XXX force re-render
        data={this.state.data}
        definition={this.state.definition}
        position={this.props.position}
      />;
    }

    this.fetchData();

    return (
      <div className="panel panel-info">
        <div className="panel-heading">
          { this.state.showControls ?

          <button type="button" className="btn btn-info btn-sm pull-right"
            onClick={this.hideControls}>
            <span className="glyphicon glyphicon-minus glyphicon-resize-small"></span>
          </button>

          :
          <button type="button" className="btn btn-info btn-sm pull-right"
            onClick={this.showControls}>
            <span className="glyphicon glyphicon-wrench glyphicon-resize-small"></span>
          </button>

          }

          {this.state.definition.description}
        </div>
        <div className="panel-body">
          {chart}
        </div>
      { this.state.showControls &&

        <div className="panel-footer">
          <Loader loaded={this.props.loaded}>
            <Controls
              definition={this.state.definition}
              schema={this.props.schema}
              setDefinition={this.setDefinition}
            />
          </Loader>
        </div>

        }
      </div>
    );
  },

  setDefinition: function (definitionAttr) {
    var definition = _.extend({}, this.state.definition, definitionAttr);
    if (!definition.groupBy || !definition.totalBy || !definition.recordType) {
      this.setState({data: []});
    }
    this.setState({definition: definition});
  },

  fetchData: function () {
    var definition = this.state.definition,
      query = _.omit(definition, ["chartType", "description"]);

    if (!definition.groupBy ||
        !definition.totalBy ||
        !definition.recordType ||
        !this.props.schema.resources) {
      return;
    }

    // save the definition as a user preference
    this.saveDefinition(definition);

    if (_.isEqual(query, this.state.previousQuery)) {
      return;
    }
    this.state.previousQuery = _.clone(query);

    var path = this.props.schema.resources[definition.recordType].methods.get.path;

    var that = this,
      url = "/" + org + "/browser-api/v1/" + path.substring(0, path.lastIndexOf("/")),
      filter = {};

    _.times(query.filterByArray.length, function (i) {
      var filterValue;

      if (query.filterByArray[i] && query.filterByValueArray[i]) {
        filterValue = parseInputValue(query.filterByValueArray[i]);
        filter["query[" + query.filterByArray[i] + "][" + filterValue.operator + "]"] =
          filterValue.value;
      }
    });

    // TODO: Need a loading image here
    $.ajax({
      url: url,
      data: _.extend({}, filter, {count: true}),
      dataType: "json",
      success: function (countData) {
        if (countData.data.data[0].count > 100) {
          alert("Too large a query for operational dashboard. Restrict your filter or invest in real BI!");
          return;
        }
        $.ajax({
          url: url,
          data: filter,
          dataType: "json",
          success: function (data) {
            that.groupChart(data.data.data, query);
          }.bind(this)
        });
      }.bind(this)
    });
  },

  groupChart: function (data, options) {
    var groupedData;
    if (data && data.length > 0 && _.isObject(data[0][options.groupBy])) {
      // prevent "[object Object]" displaying onscreen
      groupedData = _.groupBy(data, function (datum) {
        return datum[options.groupBy].name ||
          datum[options.groupBy].code ||
          datum[options.groupBy].number ||
          datum[options.groupBy].description;
      });
    } else {
      groupedData = _.groupBy(data, options.groupBy);
    }
    var totalledData = _.map(groupedData, function (dataArray, key) {
      return {
        key: key,
        total: _.reduce(dataArray, function (memo, value) {
          memo += options.totalBy === "_count" ? 1 : value[options.totalBy];
          return memo;
        }, 0)
      };
    });

    this.setState({
      data: totalledData
    });
  },

  saveDefinition: function (definition) {
    $.ajax({
      url: '/' + org + '/browser-api/v1/services/user-preference/commit-preference',
      type: "POST",
      dataType: "json",
      data: {
        attributes: [
          "DashboardAnythingQuery" + this.props.position,
          JSON.stringify(definition)
        ]
      },
      success: function (data) {
        // nothing to do
      }.bind(this),
      error: function (err) {
        // we're probably not logged in to the server
        console.log("error saving definition", err);
      }.bind(this)
    });
  },

  hideControls: function () {
    this.setState({showControls: false});
  },

  showControls: function () {
    this.setState({showControls: true});
  }


});

module.exports = ChartElement;
