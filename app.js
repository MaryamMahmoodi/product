'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing
var conf = require("./conf");
const neo4j = require("neo4j-driver");
//console.log(conf.driver);
//neo4j
/*var driver = new neo4j.driver(
  conf.neo4jBoltAddress,
  neo4j.auth.basic(conf.neo4jUsername, conf.neo4jPass)
);
driver.close();*/
var config = {
  appRoot: __dirname // required config
};

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  // install middleware
  swaggerExpress.register(app);

  var host = "http://localhost";
  var port = process.env.PORT || 10010;

  app.listen(port, function() {
    console.log(`server is running on ${host}:${port}`);
  });

});
