"use strict";
/**  @jsx React.DOM */
var React = require('react'),
  ChartMixin = require('./mixins/chart-mixin');

var PieChart = React.createClass({
  mixins: [ChartMixin], // Use the mixin

  chartType: "pie"

});

module.exports = PieChart;
