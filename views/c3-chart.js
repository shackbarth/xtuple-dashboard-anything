'use strict';

var _ = require("lodash");
var React = require('react');

/**
  The chart itself. Depending on the incoming prop.chartType, this can be
  a bar, chart, or donut chart. C3 does all the work, and also provides
  the abstration layer between charts.
*/
var C3Chart = React.createClass({

  propTypes: {
    data: React.PropTypes.array,
    definition: React.PropTypes.object,
    position: React.PropTypes.number
  },

  render: function() {
    return (
      <div id={"chart" + this.props.position} className="chart"></div>
    );
  },

  create: function (el, props, state) {
    this._chart = c3.generate(_.extend(
      {
        bindto: '#chart' + this.props.position,
        size: {
          height: 240
        },
        data: {
          columns: [],
          type : this.props.chartType
        },
        axis: {
          y: {
            label: { // ADD
              text: this.props.definition.totalBy === "_count" ? "Count" : this.props.definition.totalBy,
              position: 'outer-middle'
            }
          }
        }
      },
      this.generateOptions // not currently used
    ));
    this.update(el, state);
  },

  update: function (el, state) {
    var data = _.map(state.data, datum => {
      return [datum.key, datum.total];
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
    // TODO:
    //var el = this.getDOMNode();
    //this.destroy(el);
  }

});

module.exports = C3Chart;
