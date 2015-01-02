'use strict';

  var ChartMixin = {

    componentDidMount: function () {
      var el = this.getDOMNode();
      d3Chart.create(el, {
        width: '100%',
        height: '300px'
      }, this.getChartState());
    },

    componentDidUpdate: function () {
      var el = this.getDOMNode();
      d3Chart.update(el, this.getChartState());
    },

    getChartState: function () {
      return {
        data: this.props.data,
        domain: this.props.domain,
        stuff: this.props.stuff
      };
    },

    componentWillUnmount: function () {
      var el = this.getDOMNode();
      d3Chart.destroy(el);
    }
  }

  module.exports = ChartMixin;