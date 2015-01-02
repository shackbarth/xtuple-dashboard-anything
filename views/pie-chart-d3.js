var d3Chart = {},
  d3 = require('d3'),
  _ = require('lodash'),
  pie, svg, arc, color;

d3Chart.create = function (el, props, state) {

  var width = 960,
    height = 500,
    radius = Math.min(width, height) / 2;

  color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

  arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

  pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.total; });

  svg = d3.select(el).append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");


  this.update(el, state);
};

d3Chart.update = function (el, state) {
  // http://bl.ocks.org/mbostock/3887235
  var data = state.stuff;

  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.data.key); });

  g.append("text")
    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(function(d) { return d.data.key; });

};

d3Chart.destroy = function (el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};


module.exports = d3Chart;
