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

var App = React.createClass({
  getInitialState: function () {
    return {
      chartType: 'bar',
      data: [],
      loaded: false,
      schema: {}
    };
  },

  componentDidMount: function () {
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
  },

  render: function () {
    var chart;
    if(this.state.chartType === "bar") {
      chart = <BarChart
        data={this.state.data}
      />;
    } else if(this.state.chartType === "donut") {
      chart = <DonutChart
        data={this.state.data}
      />;
    } else {
      chart = <PieChart
        data={this.state.data}
      />;
    }

    return (
      <div className="container">
        <div className="panel panel-info">
          <div className="panel-heading">
            <h3 className="panel-title">xTuple Dashboard Anything</h3>
          </div>
          <div className="panel-body">
            {chart}
          </div>
          <div className="panel-footer">
            <Loader loaded={this.state.loaded}>
              <Controls
                schema={this.state.schema}
                fetchData={this.fetchData}
                setChartType={this.setChartType}
              />
            </Loader>
          </div>
        </div>
      </div>
    );
  },

  fetchData: function (options) {
    if (!options.groupBy || !options.totalBy) {
      return;
    }

    var that = this,
      path = options.path.substring(0, options.path.lastIndexOf("/")),
      url = "/" + org + "/browser-api/v1/" + path,
      filter = {};

    _.times(options.filterByArray.length, function (i) {
      if (options.filterByArray[i] && options.filterByValueArray[i]) {
        filter["query[" + options.filterByArray[i] + "][EQUALS]"] = options.filterByValueArray[i];
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
            that.groupChart(data.data.data, options);
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
  }


});

React.render(<App />, window.document.getElementById('content'));
