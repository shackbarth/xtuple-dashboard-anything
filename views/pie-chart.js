"use strict";
/**  @jsx React.DOM */
var React = require('react'),
  ChartMixin = require('./mixins/chart-mixin');

var PieChart = React.createClass({
  mixins: [ChartMixin], // Use the mixin

  chartType: "pie",

  propTypes: {
    data: React.PropTypes.array,
    position: React.PropTypes.string
  },

  render: function() {
    return (
      <div id={"chart" + this.props.position} className="chart"></div>
    );
  }
});

module.exports = PieChart;
