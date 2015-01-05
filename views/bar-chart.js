/**  @jsx React.DOM */
React = require('react'),
  ChartMixin = require('./mixins/chart-mixin');

var BarChart = React.createClass({
  mixins: [ChartMixin],

  chartType: "bar",

  propTypes: {
    data: React.PropTypes.array
  },

  render: function() {
    return (
      <div id="chart" className="chart"></div>
    );
  }
});

module.exports = BarChart;
