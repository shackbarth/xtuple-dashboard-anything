var d3Chart = {},
  chart,
  c3 = require('c3'),
  _ = require('lodash');

d3Chart.create = function (el, props, state) {
  chart = c3.generate({
    data: {
      columns: [],
      bindto: ".chart",
      type : 'donut'
    },
    donut: {
      title: ""
    }
  });
  this.update(el, state);
};

d3Chart.update = function (el, state) {
  var data = _.map(state.data, function (datum) {
    return [datum.key, datum.total]
  });
  chart.load({
    columns: data,
    unload: null
  });
};

d3Chart.destroy = function (el) {
  // Any clean-up would go here
  // in this example there is nothing to do
};

module.exports = d3Chart;
