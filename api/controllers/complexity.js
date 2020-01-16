'use strict';
var orders = require("./complexityService");

module.exports.postComplexity = function postComplexity(req, res, next){
    orders.postComplexity(req.swagger.params, res, next);
  };

  module.exports.modeComplexity = function modeComplexity(req, res, next){
    orders.modeComplexity(req.swagger.params, res, next);
  };
