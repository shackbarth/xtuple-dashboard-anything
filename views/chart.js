/**  @jsx React.DOM */
React = require('react'),
  d3Chart = require('./d3chart');

var Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    stuff: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    d3Chart.create(el, {
      width: '100%',
      height: '300px'
    }, this.getChartState());
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    d3Chart.update(el, this.getChartState());
  },

  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain,
      stuff: this.props.stuff
    };
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();
    d3Chart.destroy(el);
  },

  render: function() {
    return (
      <div className="chart"></div>
    );
  }
});

module.exports = Chart;

