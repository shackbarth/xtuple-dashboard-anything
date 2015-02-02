/**  @jsx React.DOM */
'use strict';

var React = require('react'),
  $ = require('jquery'),
  ChartElement = require('./chart-element'),
  url = require('url'),
  org = url.parse(window.location.href).pathname.split('/')[1];

/**
  The dashboard consists of four chart elements, each of which
  manages itself independently. But any shared resources (such
  as the data model schema) is kept in the state here.
*/
var Dashboard = React.createClass({
  getInitialState: function () {
    return {
      // has the schema been loaded from the discovery document?
      // we want to suppress the controls component until so.
      loaded: false,
      // loaded from the REST discovery document
      schema: {}
    };
  },

  componentDidMount: function () {

    // make sure that we're logged in by trying to query anything
    $.ajax({
      url: `/${org}/browser-api/v1/resources/honorific?count=true`,
      dataType: "json",
      success: (data) => {
        // nothing to do
      },
      error: (err) => {
        // we're probably not logged in to the server
        // TODO: it would be nice to redirect to the login window
        // in such a way as would keep the destination in mind for
        // when login is successful
        window.location = `/${org}/logout`;
      }
    });

    // fetch the discovery document
    $.ajax({
      url: `/${org}/discovery/v1alpha1/apis/v1alpha1/rest`,
      dataType: "json",
      success: (data) => {
        this.setState({schema: data, loaded: true});
      }
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
