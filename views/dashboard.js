/**  @jsx React.DOM */
'use strict';

var React = require('react'),
  $ = require('jquery'),
  ChartElement = require('./chart-element'),
  url = require('url'),
  org = url.parse(window.location.href).pathname.split('/')[1];

var Dashboard = React.createClass({
  getInitialState: function () {
    return {
      loaded: false,
      schema: {}
    };
  },

  componentDidMount: function () {

    // make sure that we're logged in
    $.ajax({
      url: '/' + org + '/browser-api/v1/resources/honorific?count=true',
      dataType: "json",
      success: function (data) {
        // nothing to do
      }.bind(this),
      error: function (err) {
        // we're probably not logged in to the server
        window.location = '/' + org + '/logout';
      }.bind(this)
    });

    // fetch the discovery document
    $.ajax({
      url: '/' + org + '/discovery/v1alpha1/apis/v1alpha1/rest',
      dataType: "json",
      success: function (data) {
        this.setState({schema: data, loaded: true});
      }.bind(this)
    });

  },

  render: function () {

    return (
      <div className="container">
        <div className="panel panel-info">
          <div>
            <div className="col-md-6">
              <ChartElement
                loaded={this.state.loaded}
                schema={this.state.schema}
                position={0}></ChartElement>
            </div>
            <div className="col-md-6">
              <ChartElement
                loaded={this.state.loaded}
                schema={this.state.schema}
                position={1}></ChartElement>
            </div>
          </div>
          <div>
            <div className="col-md-6">
              <ChartElement
                loaded={this.state.loaded}
                schema={this.state.schema}
                position={2}></ChartElement>
            </div>
            <div className="col-md-6">
              <ChartElement
                loaded={this.state.loaded}
                schema={this.state.schema}
                position={3}></ChartElement>
            </div>
          </div>
        </div>
      </div>
    );
  }

});

React.render(<Dashboard />, window.document.getElementById('content'));
