'use strict';

var conf = require("./../../conf.js");
var neo4j = require("neo4j-driver");

var driver = new neo4j.driver(
  conf.neo4jBoltAddress,
  neo4j.auth.basic(conf.neo4jUsername, conf.neo4jPass)
);
//~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~
exports.postEvent = function postEvent(req, res,next) {
    let response = {};
    console.log(req.body.value);
    const dbSession = driver.session();
    let title = req.body.value.title;
    let startTime = req.body.value.startTime;
    let endTime = req.body.value.endTime;
    let width = req.body.value.width;
    let height = req.body.value.height;
    let userID = req.body.value.userID
    var props = {
      title: title,
      startTime:startTime,
      endTime:endTime,
      width:width,
      height:height
    };
    let properties = {
      props:props,
      userID:userID
    };
    let query= 
    "MATCH (loginUser:user)"+
    " WHERE ID(loginUser)= toInteger($userID)"+
    " WITH loginUser"+
    " CREATE (eventNode:event)"+
    " SET eventNode += {props}"+
    " WITH loginUser, eventNode"+
    " MERGE (loginUser)-[hasEvent:hasEvent ]->(eventNode)"+
    " ON CREATE SET hasEvent.time = timestamp()"+
    " RETURN eventNode";
    return new Promise(function(resolve, reject) {
      dbSession
        .run(query, properties)
        .then(function(results) {
            console.log(results);
          let result = results.records[0];
          if (!result) {
            response.message = "No found!";
            res.json(response);
            reject(null);
          } else {
            response.message = "is created!";
            response.eventNodeID = result.get("eventNode")["identity"].toString();
            response.event = result.get("eventNode")["properties"];  
            res.status(200).json(response);
            resolve(response);
          }
          dbSession.close();
        })
        .catch(function(err) {
          throw err;
        });
    }); 
};

//~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~
exports.getEvents = function getEvents(req, res,next) {
    let response = {};
    console.log(req.id.value);
    const dbSession = driver.session();
    let userID = req.id.value;
    let properties = {
      userID:userID
    };
    let query= 
    "OPTIONAL MATCH (loginUser:user)-[:hasEvent ]->(eventNode:event)"+
    " WHERE ID(loginUser)= toInteger($userID)"+
    " AND eventNode.startTime = toString(date())" +
    " RETURN toString(ID(loginUser)) AS userID, " +
    " COLLECT({title:eventNode.title, startTime:eventNode.startTime,"+
    " endTime:eventNode.endTime, width:eventNode.width, height:eventNode.height," +
    " eventID:toString(ID(eventNode))})[0..100] AS events";
    return new Promise(function(resolve, reject) {
      dbSession
        .run(query, properties)
        .then(function(results) {
            console.log(results.records[0]);
          var result = results.records[0];
          if (!result) {
            response.message = "No found!";
            res.json(response);
            reject(null);
          } else {
            response.message = "there is events!";
            response.userID = result.get("userID");
            response.event = result.get("events");  
            res.status(200).json(response);
            resolve(response);
          }
          dbSession.close();
        })
        .catch(function(err) {
          throw err;
        });
    }); 
};
//~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~
exports.deleteEvent = function deleteEvent(req, res,next) {
    let response = {};
    console.log(req.id.value);
    const dbSession = driver.session();
    let eventID = req.id.value;
    let properties = {
        eventID:eventID
    };
    let query= 
    "OPTIONAL MATCH (:user)-[:hasEvent ]->(eventNode:event)"+
    " WHERE ID(eventNode)= toInteger($eventID)"+
    " DETACH DELETE eventNode ";
    return new Promise(function(resolve, reject) {
      dbSession
        .run(query, properties)
        .then(function(results) {
          //var result = results.records[0];
          if (results.summary.updateStatistics.nodesDeleted == 0) {
            response.message = "Nothing has been deleted";
            res.json(response);
            reject(null);
          } else {
            response.message = "Event Successfully Deleted";
            res.status(200).json(response);
            resolve(response);
          }
          dbSession.close();
        })
        .catch(function(err) {
          throw err;
        });
    }); 
};

//~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~.~
exports.updateEvent = function updateEvent(req, res,next) {
    let response = {};
    //console.log(req.body);
    const dbSession = driver.session();
    let eventID = req.eventID.value;
    let userID = req.userID.value;
    let title = req.body.value.title;
    let startTime = req.body.value.startTime;
    let endTime = req.body.value.endTime;
    let width = req.body.value.width;
    let height = req.body.value.height;
    
    var props = {
        title: title,
        startTime:startTime,
        endTime:endTime,
        width:width,
        height:height
      };
    let properties = {
        userID:userID,
        eventID:eventID,
        props:props
    };
    let query= 
    " MATCH (user:user)-[:hasEvent]->(eventNode:event)"+
    " WHERE ID(eventNode)= toInteger($eventID)"+
    " AND ID(user)= toInteger($userID)"+
    " SET eventNode += {props}"+
    " RETURN eventNode ";
    return new Promise(function(resolve, reject) {
      dbSession
        .run(query, properties)
        .then(function(results) {
          console.log(results.summary.updateStatistics);
          let result = results.records[0];
          if (results.summary.updateStatistics.propertiesSet == 0) {
            response.message = "Nothing has been updated";
            res.json(response);
            reject(null);
          } else {
            response.message = "Event Successfully update";
            response.eventID = result.get("eventNode")["identity"].toString();
            res.status(200).json(response);
            resolve(response);
          }
          dbSession.close();
        })
        .catch(function(err) {
          throw err;
        });
    }); 
};