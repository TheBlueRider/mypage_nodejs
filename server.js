#!/bin/env node
//  OpenShift sample Node application
var express = require('express')
  , fs = require('fs')
  , app = express() // Web framework to handle routing requests
  , cons = require('consolidate') // Templating library adapter for Express
  , MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB
  , routes = require('./routes'); // Routes for our application


/**
 *  Define the sample application.
 */
 var url = 'mongodb://'+
              OPENSHIFT_MONGODB_DB_USERNAME+':'+OPENSHIFT_MONGODB_DB_PASSWORD+
              '@'+OPENSHIFT_MONGODB_DB_HOST+':'+OPENSHIFT_MONGODB_DB_PORT;
 MongoClient.connect(url+'/stockdb', function(err, db) {
     "use strict";
     if(err) throw err;

     // Register our templating engine
     app.engine('html', cons.swig);
     app.set('view engine', 'html');
     app.set('views', __dirname + '/views');

     // Express middleware to populate 'req.cookies' so we can access cookies
     app.use(express.cookieParser());

     // Express middleware to populate 'req.body' so we can access POST variables
     app.use(express.bodyParser());

     // Application routes
     routes(app, db);

     app.listen(8082);
     console.log('Express server listening on port 8082');
 });
