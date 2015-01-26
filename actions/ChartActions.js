"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher');

var ChartActions = {

  /**
   * @param  {string} text
   */
  create: function(text) {
    console.log("dispatching to ", text, AppDispatcher);
    AppDispatcher.dispatch({
      actionType: "foo",// TodoConstants.TODO_CREATE,
      text: text
    });
  }


};

module.exports = ChartActions;
