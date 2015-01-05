/**  @jsx React.DOM */
React = require('react'),
  ChartMixin = require('./mixins/chart-mixin');

var PieChart = React.createClass({
  mixins: [ChartMixin], // Use the mixin

  chartType: "pie",

  propTypes: {
    data: React.PropTypes.array,
  },

  render: function() {
    return (
      <div id="chart" className="chart"></div>
    );
  }
});

module.exports = PieChart;
