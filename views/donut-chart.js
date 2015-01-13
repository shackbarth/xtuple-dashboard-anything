"use strict";

/**  @jsx React.DOM */
var React = require('react'),
  ChartMixin = require('./mixins/chart-mixin');

var DonutChart = React.createClass({
  mixins: [ChartMixin],

  propTypes: {
    data: React.PropTypes.array,
  },

  chartType: "donut",

  render: function() {
    return (
      <div id="chart" className="chart"></div>
    );
  }
});

module.exports = DonutChart;
