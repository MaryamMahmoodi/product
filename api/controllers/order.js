'use strict';
var orders = require("./orderServices");

module.exports.postOrder = function postOrder(req, res, next){
  orders.postOrder(req.swagger.params, res, next);
};


module.exports.getOrder = function getOrder(req, res, next){
  orders.getOrder(req.swagger.params, res, next);
};

