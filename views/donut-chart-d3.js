var d3Chart = {},
  c3 = require('c3'),
  chart,
  d3 = require('d3'),
  _ = require('lodash');


d3Chart.create = function (el, props, state) {

  chart = c3.generate({
    data: {
      columns: [
      ],
      bindto: ".chart",
      type : 'donut'
    },
    donut: {
      title: ""
    }
  });
  this.update(el, state);
    /*
    d3.select(".chart")
      .style('min-height', props.height);

  this.update(el, state);
  */
};

d3Chart.update = function (el, state) {
  var data = _.map(state.data, function (datum) {
    return [datum.key, datum.total]
  });
  chart.load({
    columns: data,
    unload: null
  });

  /*
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
  */
};

d3Chart.destroy = function (el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

module.exports = d3Chart;
