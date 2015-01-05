'use strict';

  var ChartMixin = {

    create: function (el, props, state) {
      this._chart = c3.generate({
        data: {
          columns: [],
          bindto: ".chart",
          type : this.chartType
        }//,
        //donut: {
        //  title: ""
        //}
      });
      this.update(el, state);
    },

    update: function (el, state) {
      var data = _.map(state.data, function (datum) {
        return [datum.key, datum.total]
      });
      this._chart.load({
        columns: data,
        unload: null
      });
    },

    componentDidMount: function () {
      var el = this.getDOMNode();
      this.create(el, {
        width: '100%',
        height: '300px'
      }, this.getChartData());
    },

    componentDidUpdate: function () {
      var el = this.getDOMNode();
      this.update(el, this.getChartData());
    },

    getChartData: function () {
      return {
        data: this.props.data
      };
    },

    componentWillUnmount: function () {
      var el = this.getDOMNode();
      // TODO:
      //this.destroy(el);
    }


  }

  module.exports = ChartMixin;
