/**  @jsx React.DOM */
'use strict';

var React = require('react'),
  $ = require('jquery'),
  _ = require('lodash'),
  Loader = require('react-loader'),
  Controls = require('./controls'),
  PieChart = require('./pie-chart'),
  DonutChart = require('./donut-chart'),
  BarChart = require('./bar-chart'),
  url = require('url'),
  org = url.parse(window.location.href).pathname.split('/')[1];

var ChartElement = React.createClass({
  propTypes: {
    position: React.PropTypes.string
  },

  getInitialState: function () {
    return {
      chartType: 'bar',
      data: [],
      loaded: false,
      showControls: false,
      schema: {},
      query: {
        filterByArray: [],
        filterByValueArray: []
      }
    };
  },

  componentDidMount: function () {
    var that = this;

    // make sure that we're logged in
    $.ajax({
      url: '/' + org + '/browser-api/v1/resources/honorific?count=true',
      dataType: "json",
      success: function (data) {
        // nothing to do
      }.bind(this),
      error: function (err) {
        // we're probably not logged in to the server
        window.location = '/' + org + '/logout';
      }.bind(this)
    });

    // fetch the discovery document
    $.ajax({
      url: '/' + org + '/discovery/v1alpha1/apis/v1alpha1/rest',
      dataType: "json",
      success: function (data) {
        this.setState({schema: data, loaded: true});
      }.bind(this)
    });

    this.fetchSavedQuery(function (err, result) {
      if (err) {
        console.log("Error fetching saved query", err);
        return;
      }
      that.setState({query: result.query, chartType: result.chartType});
    });
  },

  // mockup until we get the route working
  fetchSavedQuery: function (callback) {
    // TODO: use this.props.position
    console.log("position is", this.props.position);
    var mockResult = '{"chartType":"donut","filterByArray":["status"],"filterByValueArray":["R"],"recordType":"Incident","groupBy":"category","totalBy":"_count"}';

    var result = JSON.parse(mockResult);
    result.filterByArray = result.filterByArray || [];
    result.filterByValueArray = result.filterByValueArray || [];
    var chartType = result.chartType;
    delete result.chartType;
    callback(null, {query: result, chartType: chartType});
  },

  render: function () {
    var chart;
    if(this.state.chartType === "bar") {
      chart = <BarChart
        data={this.state.data}
        position={this.props.position}
      />;
    } else if(this.state.chartType === "donut") {
      chart = <DonutChart
        data={this.state.data}
        position={this.props.position}
      />;
    } else {
      chart = <PieChart
        data={this.state.data}
        position={this.props.position}
      />;
    }

    this.fetchData();

    return (
      <div className="panel panel-info">
        <div className="panel-body">
          {chart}
        </div>
      { this.state.showControls ?

        <div className="panel-footer">
          <Loader loaded={this.state.loaded}>
            <Controls
              chartType={this.state.chartType}
              query={this.state.query}
              schema={this.state.schema}
              setChartType={this.setChartType}
              setQuery={this.setQuery}
            />
          </Loader>
          <button type="button" className="btn btn-info btn-sm pull-right"
            onClick={this.hideControls}>
            <span className="glyphicon glyphicon-minus glyphicon-resize-small"></span>
          </button>
        </div>

        :

        <button type="button" className="btn btn-info btn-sm pull-right"
          onClick={this.showControls}>
          <span className="glyphicon glyphicon-wrench glyphicon-resize-small"></span>
        </button>
        }
      </div>
    );
  },

  setQuery: function (query) {
    if (!query.groupBy || !query.totalBy || !query.recordType) {
      this.setState({data: []});
    }
    this.setState({query: _.extend({}, this.state.query, query)});
  },

  fetchData: function () {
    var query = this.state.query;

    if (!query.groupBy || !query.totalBy || !query.recordType || !this.state.schema.resources) {
      return;
    }
    if (_.isEqual(query, this.state.previousQuery)) {
      return;
    }
    this.state.previousQuery = _.clone(query);
    var path = this.state.schema.resources[this.state.query.recordType].methods.get.path;

    var that = this,
      url = "/" + org + "/browser-api/v1/" + path.substring(0, path.lastIndexOf("/")),
      filter = {};

    _.times(query.filterByArray.length, function (i) {
      if (query.filterByArray[i] && query.filterByValueArray[i]) {
        filter["query[" + query.filterByArray[i] + "][EQUALS]"] = query.filterByValueArray[i];
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

  setChartType: function (chartType) {
    this.setState({chartType: chartType});
  },

  hideControls: function () {
    this.setState({showControls: false});
  },

  showControls: function () {
    this.setState({showControls: true});
  }


});

module.exports = ChartElement;
