/**  @jsx React.DOM */
'use strict';

var React = require('react'),
  $ = require('jquery'),
  _ = require('lodash'),
  Loader = require('react-loader'),
  url = require('url'),
  Controls = require('./controls'),
  C3Chart = require('./c3-chart'),
  parseInputValue = require("../util/parse-input-value"),
  defaultDefinitions = require("../util/default-definitions"),
  org = url.parse(window.location.href).pathname.split('/')[1],
  ROW_LIMIT = 200; // possibly make configurable

/**
  A chart element consists of a c3 chart and a set of expandable
  controls to manage the definition of that chart. The definition
  of each chart are saved as user preferences so that they can
  stick from one session to the next
*/
var ChartElement = React.createClass({
  propTypes: {
    position: React.PropTypes.number, // 0 - 3 for the four chart onscreen
    loaded: React.PropTypes.bool,
    schema: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      data: [],
      showControls: false,
      definition: {
        chartType: 'bar',
        filterByArray: [],
        filterByValueArray: []
      }
    };
  },

  componentDidMount: function () {
    this.fetchSavedDefinition((err, result) => {
      if (err) {
        console.log("Error fetching saved query", err);
        return;
      }
      this.setState({definition: result.definition});
    });
  },

  /**
    Fetch the definition of the chart from userpreferences. If none are found,
    or upon error (the pre-4.9 server won't support these calls) then use
    some nice defaults
  */
  fetchSavedDefinition: function (callback) {

    $.ajax({
      url: `/${org}/browser-api/v1/services/user-preference/get-preference`,
      type: "POST",
      dataType: "json",
      data: {
        attributes: [
          `DashboardAnythingQuery${this.props.position}`
        ]
      },
      success: (data) => {
        let result = data.data.result.length ?
          JSON.parse(data.data.result[0].userpref_value) :
          defaultDefinitions[this.props.position];
        callback(null, {definition: result});
      },
      error: (err) => {
        let result = defaultDefinitions[this.props.position];
        callback(null, {definition: result});
      }
    });
  },

  /**
    Render:
      -The title of the chart
      -The chart
      -The controls, unless they're set to be hidden
  */
  render: function () {

    // XXX the re-render, insofar as it's a proxy for a change in state,
    // seems like an expedient time to possibly requery the server. There
    // might be a react-ier place to put this
    this.fetchData();

    return (
      <div className="panel panel-info">
        <div className="panel-heading">
          { this.state.showControls ?

          <button type="button" className="btn btn-info btn-sm pull-right"
            onClick={this.hideControls}>
            <span className="glyphicon glyphicon-minus glyphicon-resize-small"></span>
          </button>

          :

          <button type="button" className="btn btn-info btn-sm pull-right"
            onClick={this.showControls}>
            <span className="glyphicon glyphicon-wrench glyphicon-resize-small"></span>
          </button>

          }

        {
          this.state.definition.description ||
          `${this.state.definition.recordType || ''} by ${this.state.definition.groupBy || ''}`
        }
        </div>
        <div className="panel-body">
        { this.state.rowCount > ROW_LIMIT ?

          <div className="row-limit-message">
            { this.state.rowCount } records requested. Only {ROW_LIMIT} results are
            allowed for operational dashboards. Please restrict your filters.
            Or perhaps you are interested in analytics-grade Business
            Intelligence? If so, contact your sales rep!
          </div>

        :

          <C3Chart
            chartType={this.state.definition.chartType}
            key={String(Math.random())} // XXX force re-render
            data={this.state.data}
            definition={this.state.definition}
            position={this.props.position}
          />

        }
        </div>
      { this.state.showControls &&

        <div className="panel-footer">
          <Loader loaded={this.props.loaded}>
            <Controls
              definition={this.state.definition}
              schema={this.props.schema}
              setDefinition={this.setDefinition}
            />
          </Loader>
        </div>

        }
      </div>
    );
  },

  /**
    The callback function that we pass down to the controls component so
    that it might reach back and make changes to the definition in this
    component's state
  */
  setDefinition: function (definitionAttr) {
    let definition = _.extend({}, this.state.definition, definitionAttr);
    if (!definition.groupBy || !definition.totalBy || !definition.recordType) {
      // ensure that we wipe out the chart if the user has borked the query
      this.setState({data: []});
    }
    this.setState({definition: definition});
  },

  // XXX big and hairy. break down into smaller pieces
  fetchData: function () {
    let definition = this.state.definition,
      query = _.omit(definition, ["chartType", "description"]);

    if (!definition.groupBy ||
        !definition.totalBy ||
        !definition.recordType ||
        !this.props.schema.resources) {
      return;
    }

    // save the definition as a user preference
    this.saveDefinition(definition);

    if (_.isEqual(query, this.state.previousQuery)) {
      return;
    }
    this.state.previousQuery = _.clone(query);

    let path = this.props.schema.resources[definition.recordType].methods.get.path;

    let url = `/${org}/browser-api/v1/${path.substring(0, path.lastIndexOf("/"))}`,
      filter = {};

    _.times(query.filterByArray.length, (i) => {
      if (query.filterByArray[i] && query.filterByValueArray[i]) {
        let filterValue = parseInputValue(query.filterByValueArray[i]);
        filter[`query[${query.filterByArray[i]}][${filterValue.operator}]`] =
          filterValue.value;
      }
    });

    // TODO: Need a loading image here
    $.ajax({
      url: url,
      data: _.extend({}, filter, {count: true}),
      dataType: "json",
      success: (countData) => {
        let rowCount = countData.data.data[0].count;
        this.setState({rowCount});
        if (rowCount > ROW_LIMIT) {
          return;
        }
        $.ajax({
          url: url,
          data: _.extend({}, filter, {rowlimit: ROW_LIMIT}),
          dataType: "json",
          success: (data) => {
            this.groupChart(data.data.data, query);
          }
        });
      }
    });
  },

  /**
    The data coming back from REST is not in the format that c3 will want it.
    Group the data intelligently before we set the state.
  */
  groupChart: function (data, options) {
    let groupedData;
    if (data && data.length > 0 && _.isObject(data[0][options.groupBy])) {
      // prevent "[object Object]" displaying onscreen
      groupedData = _.groupBy(data, function (datum) {
        return datum[options.groupBy].name ||
          datum[options.groupBy].code ||
          datum[options.groupBy].number ||
          datum[options.groupBy].description ||
          datum[options.groupBy].username;
      });
    } else {
      groupedData = _.groupBy(data, options.groupBy);
    }
    let totalledData = _.map(groupedData, (dataArray, key) => {
      return {
        key: key,
        total: _.reduce(dataArray, function (memo, value) {
          memo += options.totalBy === "_count" ? 1 : value[options.totalBy];
          return memo;
        }, 0)
      };
    });

    this.setState({
      data: totalledData
    });
  },

  /**
    Persist the current definition of the chart as a user preference in the database
  */
  saveDefinition: function (definition) {
    $.ajax({
      url: `/${org}/browser-api/v1/services/user-preference/commit-preference`,
      type: "POST",
      dataType: "json",
      data: {
        attributes: [
          `DashboardAnythingQuery${this.props.position}`,
          JSON.stringify(definition)
        ]
      },
      success: function (data) {
        // nothing to do
      },
      error: function (err) {
        // maybe we're on a pre-4.9 server?
        console.log("error saving definition", err);
      }
    });
  },

  hideControls: function () {
    this.setState({showControls: false});
  },

  showControls: function () {
    this.setState({showControls: true});
  }

});

module.exports = ChartElement;
