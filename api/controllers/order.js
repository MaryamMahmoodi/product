'use strict';
var orders = require("./orderServices");
module.exports.getOrder = function getOrder(req, res, next){
  //console.log(".......................");
  //console.log(req.swagger);
  orders.getOrder(req.swagger.params, res, next);
};
