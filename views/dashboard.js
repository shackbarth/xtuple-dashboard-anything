/**  @jsx React.DOM */
'use strict';

var React = require('react'),
  _ = require('lodash'),
  ChartElement = require('./chart-element'),
  url = require('url');

var Dashboard = React.createClass({
  getInitialState: function () {
    return {

    };
  },

  //componentDidMount: function () {

  //},

  render: function () {

    return (
      <div className="container">
        <div className="panel panel-info">
          <div className="panel-heading">
            <h3 className="panel-title">xTuple Dashboard Anything</h3>
          </div>
          <div>
            <div className="col-md-6">
              <ChartElement position="1" />
            </div>
            <div className="col-md-6">
              <ChartElement position="2" />
            </div>
          </div>
        </div>
      </div>
    );
  }

});

React.render(<Dashboard />, window.document.getElementById('content'));
