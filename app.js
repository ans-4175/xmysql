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
      host: process.env.DATABASE_HOST || "127.0.0.1",
      port: parseInt(process.env.DATABASE_PORT) || 3306,
      database: process.env.DATABASE_NAME || 'db_name',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASS || 'admin123',
      apiPrefix: process.env.API_PREFIX || "/api/",
      ipAddress: process.env.HOST || "127.0.0.1",
      portNumber: parseInt(process.env.PORT_APP) || 80,
      ignoreTables: (process.env.IGNORE_TABLES) ? process.env.IGNORE_TABLES.split(',') : [],
      storageFolder: process.env.STORAGE_FOLDER || `${__dirname}/storage`
    };

    var mysqlPool = mysql.createPool(mysqlConfig);
    var xapi = new Xapi(mysqlConfig, mysqlPool, app);
    xapi.init(function(err, results) {
      app.listen(mysqlConfig.portNumber);
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
