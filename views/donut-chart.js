/**  @jsx React.DOM */
React = require('react'),
  ChartMixin = require('./mixins/chart-mixin'),
  d3Chart = require('./donut-chart-d3');

var DonutChart = React.createClass({
  mixins: [ChartMixin], // Use the mixin

  d3Chart: d3Chart,

  propTypes: {
    data: React.PropTypes.array,
  },

  render: function() {
    return (
      <div id="chart" className="chart"></div>
    );
  }
});

module.exports = DonutChart;
