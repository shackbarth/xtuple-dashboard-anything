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
      showControls: true, // TODO: make false
      schema: {},
      query: {
        filterByArray: [],
        filterByValuesArray: []
      }
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
    console.log("render");
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

    this.fetchData();

    return (
      <div className="container">
        <div className="panel panel-info">
          <div className="panel-heading">
            <h3 className="panel-title">xTuple Dashboard Anything</h3>
          </div>
          <div className="panel-body">
            {chart}
          </div>
        { this.state.showControls ?

          <div className="panel-footer">
            <Loader loaded={this.state.loaded}>
              <Controls
                query={this.state.query}
                schema={this.state.schema}
                setChartType={this.setChartType}
                setQuery={this.setQuery}
              />
            </Loader>
          </div>

          :

          <button type="button" className="btn btn-info pull-right"
            onClick={this.showControls}>
            <span className="glyphicon glyphicon-wrench"></span>
          </button>
          }
        </div>
      </div>
    );
  },

  setQuery: function (query) {
    this.setState({query: _.extend({}, this.state.query, query)});
  },

  fetchData: function () {
    var query = this.state.query;

    if (!query.groupBy || !query.totalBy) {
      return;
    }
    if (_.isEqual(query, this.state.previousQuery)) {
      return;
    }
    this.state.previousQuery = _.clone(query);
    var path = this.state.query.recordType &&
      this.state.schema.resources[this.state.query.recordType].methods.get.path;

    path = path && path.substring(0, path.lastIndexOf("/"));

    console.log("fetching data", path);
    var that = this,
      url = "/" + org + "/browser-api/v1/" + path,
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
            console.log("data success");
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

  showControls: function () {
    this.setState({showControls: true});
  }


});

React.render(<App />, window.document.getElementById('content'));
