"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var CHANGE_EVENT = 'change';

var ChartDataStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {
  console.log("action is", action);
  var text;

  switch(action.actionType) {
    case "foo": //TodoConstants.TODO_CREATE:
      text = action.text.trim();
      if (text !== '') {
        console.log("foo is", text);
        //create(text);
      }
      ChartDataStore.emitChange();
      break;

    default:
      // no op
  }
});

module.exports = ChartDataStore;
