'use strict';

var util = require('util');

exports.getOrder = function getOrder(req, res,next) {
    var name = req.name.value;
    //console.log(req);
    res.json(name);
  }



