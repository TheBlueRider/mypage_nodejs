#!/bin/env node
//  OpenShift sample Node application
var express = require('express')
  , fs = require('fs')
  , app = express() // Web framework to handle routing requests
  , cons = require('consolidate') // Templating library adapter for Express
  , MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB
  , RoutesHandle = require('./routes/route.js') // Routes for our application // Routes for our application
  , ProcessHandle = require('./routes/process.js')
  , SocketHandle = require('./routes/socket.js')
  , UpdateHandle = require('./routes/update.js')
  , events = require('events')
  , eventEmitter = new events.EventEmitter()
  , swig = require('swig');

/**
 *  Define the sample application.
 */
 var host = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
 var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
 var mongo_url = process.env.OPENSHIFT_MONGODB_DB_URL;
 MongoClient.connect(mongo_url+'/bluerider', function(err, db) {
 //MongoClient.connect('mongodb://localhost:27017/stockdb', function(err, db) {
     "use strict";
     if(err) throw err;

     swig.setFilter('floatpoint', function (input,number) {
       return parseFloat(input).toFixed(number);
     });
     // Register our templating engine
     app.engine('html', swig.renderFile);
     app.set('view engine', 'html');
     app.set('views', __dirname + '/views');
     app.use(express.static(__dirname + '/public'));
     // Express middleware to populate 'req.cookies' so we can access cookies
     app.use(express.cookieParser());

     // Express middleware to populate 'req.body' so we can access POST variables
     app.use(express.bodyParser());

     // Application routes
     RoutesHandle(app, db, eventEmitter);

     //Handle async process
     var processhandle = new ProcessHandle(db, eventEmitter);
     var updatehandle = new UpdateHandle(db, eventEmitter);
     //create async process
     processhandle.createprocess();
     //create updatelistener
     updatehandle.createlistener();

     eventEmitter.on('newstock', function (message) {
       processhandle.restartprocess();
     });

     var server = app.listen(port, host);
     //var server = app.listen(8082);

     //Handle client's socket
     var sockethandle = new SocketHandle(server, eventEmitter);

     //create socket to each client
     sockethandle.createsocket();

     console.log('Express server listening on port 8082');
 });
