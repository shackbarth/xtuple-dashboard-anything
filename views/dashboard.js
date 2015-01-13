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
          <div>
            <div className="col-md-6">
              <ChartElement position={0}></ChartElement>
            </div>
            <div className="col-md-6">
              <ChartElement position={1}></ChartElement>
            </div>
          </div>
          <div>
            <div className="col-md-6">
              <ChartElement position={2}></ChartElement>
            </div>
            <div className="col-md-6">
              <ChartElement position={3}></ChartElement>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

React.render(<Dashboard />, window.document.getElementById('content'));
