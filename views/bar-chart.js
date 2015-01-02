/**  @jsx React.DOM */
React = require('react'),
  ChartMixin = require('./mixins/chart-mixin'),
  d3Chart = require('./bar-chart-d3');

var BarChart = React.createClass({

  d3Chart: d3Chart,

  mixins: [ChartMixin], // Use the mixin

  propTypes: {
    data: React.PropTypes.array,
  },

  render: function() {
    return (
      <div className="chart"></div>
    );
  }
});

module.exports = BarChart;
