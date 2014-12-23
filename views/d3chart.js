var d3Chart = {},
  d3 = require('d3'),
  _ = require('lodash');

d3Chart.create = function (el, props, state) {
    d3.select(".chart")
      .style('width', props.width)
      .style('height', props.height);

  this.update(el, state);
};

d3Chart.update = function (el, state) {
  // http://bost.ocks.org/mike/bar/
  var x = d3.scale.linear()
    .domain([0, d3.max(_.map(state.stuff, function (stu) { return stu.total }))])
    .range([0, 420]);

  d3.select(".chart")
    .selectAll("div")
      .data(state.stuff)
    .enter().append("div")
      .style("width", function (d) { return x(d) * 40 + "px"; })
      .text(function (d) { return d.key + ": " + d.total; });
};

d3Chart.destroy = function (el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

module.exports = d3Chart;
