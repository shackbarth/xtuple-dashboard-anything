"use strict";

/**  @jsx React.DOM */
var React = require('react'),
  ChartMixin = require('./mixins/chart-mixin');

var DonutChart = React.createClass({
  mixins: [ChartMixin],

  chartType: "donut",

});

module.exports = DonutChart;
