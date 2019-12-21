'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
module.exports = app; // for testing

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

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log(`server is running on ${host}:${port}`);
  }
});
