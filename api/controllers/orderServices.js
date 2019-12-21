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
    console.log(req.body);
    var props ={}
    props.name = req.body.name;
    props.size = req.body.size;
    props.description= req.body.description;
    
    var properties = {
        props:props
      };
      var query =
      `CREATE (orderNode:order { props })
        RETURN orderNode `;
      return new Promise(function(resolve, reject) {
        dbSession
          .run(query, properties)
          .then(function(results) {
            const result = results.records[0];
            if (!result) {
              response.message = "Error";
              res.status(400).send(response);
              reject(null);
            } else {
              response.message = "Successfully!";
              response.orderID = result.get("orderNode")["identity"].toString();
              //response.order = result.get("orderNode")["properties"];
              res.status(200).json(response);
              resolve(response);
            }
            dbSession.close();
          })
          .catch(function(err) {
            throw err;
          });
      });
  }



  exports.getOrder = function getOrder(req, res,next) {
    var response = {};
    const dbSession = driver.session();
    var orderID = req.id.value;
    console.log(req.id.value);
    var properties = {
        orderID:orderID
      };
      var query =
      `MATCH (orderNode:order)
        WHERE id(orderNode)=toInteger($orderID )
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
              response.order = result.get("orderNode")["properties"];
              res.status(200).json(response);
              resolve(response.orderID);
            }
            dbSession.close();
          })
          .catch(function(err) {
            throw err;
          });
      });
  }