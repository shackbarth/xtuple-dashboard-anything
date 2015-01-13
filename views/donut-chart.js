"use strict";

/**  @jsx React.DOM */
var React = require('react'),
  ChartMixin = require('./mixins/chart-mixin');

var DonutChart = React.createClass({

  mixins: [ChartMixin],

  propTypes: {
    data: React.PropTypes.array,
    position: React.PropTypes.string
  },

  chartType: "donut",

  render: function() {
    return (
      <div id={"chart" + this.props.position} className="chart"></div>
    );
  }
});

module.exports = DonutChart;
