/**  @jsx React.DOM */
React = require('react'),
  ChartMixin = require('./mixins/chart-mixin'),
  d3Chart = require('./pie-chart-d3');

var PieChart = React.createClass({
  mixins: [ChartMixin], // Use the mixin

  d3Chart: d3Chart,

  propTypes: {
    data: React.PropTypes.array,
    stuff: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  render: function() {
    return (
      <div className="chart"></div>
    );
  }
});

module.exports = PieChart;
