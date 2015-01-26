"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher');

var ChartActions = {

  /**
   * @param  {string} text
   */
  create: function(text) {
    AppDispatcher.dispatch({
      actionType: "hello",// TodoConstants.TODO_CREATE,
      text: text
    });
  }


};

module.exports = ChartActions;
