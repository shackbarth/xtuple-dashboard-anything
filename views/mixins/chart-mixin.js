'use strict';

  var ChartMixin = {

    componentDidMount: function () {
      var el = this.getDOMNode();
      this.d3Chart.create(el, {
        width: '100%',
        height: '300px'
      }, this.getChartState());
    },

    componentDidUpdate: function () {
      var el = this.getDOMNode();
      this.d3Chart.update(el, this.getChartState());
    },

    getChartState: function () {
      return {
        data: this.props.data
      };
    },

    componentWillUnmount: function () {
      var el = this.getDOMNode();
      this.d3Chart.destroy(el);
    }
  }

  module.exports = ChartMixin;
