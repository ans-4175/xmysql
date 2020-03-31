var bodyParser = require("body-parser");
var express = require("express");
var cors = require("cors");
var mysql = require("mysql");
var morgan = require("morgan");

var app = express();
var Xapi = require("./lib/xapi.js");

var onXapiInitialized = new Promise(function(resolve, reject) {
  try {
    // /**************** START : setup express ****************/
    app.use(morgan("tiny"));
    app.use(cors());
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );
    // /**************** END : setup express ****************/

    app.use(function(req, res, next) {
      // You can add authentication here
      // console.log("Received request for: " + req.url, req);
      next();
    });

    var mysqlConfig = {
      host: '127.0.0.1',
      port: 3306,
      database: 'sheets',
      user: 'root',
      password: 'bismillah',
      apiPrefix: "/api/",
      ipAddress: "localhost",
      portNumber: 3000,
      ignoreTables: [],
      storageFolder: __dirname
    };

    var mysqlPool = mysql.createPool(mysqlConfig);
    var xapi = new Xapi(mysqlConfig, mysqlPool, app);
    xapi.init(function(err, results) {
      app.listen(mysqlConfig.port);
      resolve();
    });
  } catch (err) {
    reject(err);
  }
});

// function handler(event, context, callback) {
onXapiInitialized.then(function() {
  console.log('running')
});
// }
// 
// exports.handler = handler;
