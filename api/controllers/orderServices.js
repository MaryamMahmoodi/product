'use strict';

//var util = require('util');
var conf = require("./../../conf.js");
var neo4j = require("neo4j-driver");

var driver = new neo4j.driver(
  conf.neo4jBoltAddress,
  neo4j.auth.basic(conf.neo4jUsername, conf.neo4jPass)
);

exports.postOrder = function postOrder(req, res,next) {
    var response = {};
    const dbSession = driver.session();
    var props ={}
    props.name = req.body.name;
    props.size = req.body.size;
    props.description= req.body.description;
    var properties = {
        props:props
      };
      var query =
      `CREATE (orderNode:order) 
        SET orderNode += {props}
        RETURN orderNode `;
      return new Promise(function(resolve, reject) {
        dbSession
          .run(query, properties)
          .then(function(results) {
            const result = results.records[0];
            if (!result) {
              response.message = "Error";
              res.status(400).send(response);
              console.log("Notfound.");
              reject(null);
            } else {
              response.message = "Successfully!";
              response.orderID = result.get("orderNode")["identity"].toString();
              res.json(response);
              resolve(response.orderID);
            }
            dbSession.close();
          })
          .catch(function(err) {
            throw err;
          });
      });
  }



