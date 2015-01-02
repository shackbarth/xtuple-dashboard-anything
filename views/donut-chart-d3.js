var d3Chart = {},
  c3 = require('c3'),
  d3 = require('d3'),
  _ = require('lodash');


d3Chart.create = function (el, props, state) {

var chart = c3.generate({
  data: {
    columns: [
      ['data1', 30],
      ['data2', 120],
    ],
    bindto: ".chart",
    type : 'donut',
    onclick: function (d, i) { console.log("onclick", d, i); },
    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
  },
  donut: {
    title: "Iris Petal Width"
  }
});
    /*
    d3.select(".chart")
      .style('min-height', props.height);

  this.update(el, state);
  */
};

d3Chart.update = function (el, state) {
  // http://bost.ocks.org/mike/bar/
  var x = d3.scale.linear()
    .domain([0, d3.max(_.map(state.data, function (datum) { return datum.total }))])
    .range([0, 420]);

  d3.select(".chart")
    .selectAll("div")
      .data(state.data)
    .enter().append("div")
      .style("width", function (d) { return x(d) * 40 + "px"; })
      .text(function (d) { return d.key + ": " + d.total; });
};

d3Chart.destroy = function (el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

module.exports = d3Chart;
