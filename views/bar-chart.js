/**  @jsx React.DOM */
React = require('react'),
  ChartMixin = require('./mixins/chart-mixin');

var BarChart = React.createClass({
  mixins: [ChartMixin],

  chartType: "bar",

  generateOptions: {
    //bar: {
    //  width: {
    //    ratio: 0.5 // this makes bar width 50% of length between ticks
    //  }
    //}
  },

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
