'use strict';
var orders = require("./calenderServices");

module.exports.getEvents = function getEvents(req, res, next){
    orders.getEvents(req.swagger.params, res, next);
  };
  module.exports.postEvent = function postEvent(req, res, next){
    orders.postEvent(req.swagger.params, res, next);
  };
 module.exports.deleteEvent = function deleteEvent(req, res, next){
    orders.deleteEvent(req.swagger.params, res, next);
  };
  module.exports.updateEvent = function updateEvent(req, res, next){
    orders.updateEvent(req.swagger.params, res, next);
  };
  module.exports.getEventWithID = function getEventWithID(req, res, next){
    orders.getEventWithID(req.swagger.params, res, next);
  };
  