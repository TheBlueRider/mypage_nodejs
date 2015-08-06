var StockDAO = require('../stock').StockDAO;

function ProccessHandle(db, eventEmitter) {
  var stocks = new StockDAO(db);
  var childprocess = require('child_process');
  var gdprocess;
  var pointlist = [];

  this.createprocess = function(){
    stocks.getAllStocks(function(err, results) {
        "use strict";
        console.log('start process');
        if (err) { console.log("error occured when execute mongo query"); return; }
        var stockstring = '';

        for (var index= 0; index < results.length; index++)
        {
          stockstring += results[index]['market']+results[index]['stock_id']+',';
        }

        gdprocess = childprocess.fork(__dirname + '/getdata.js', [stockstring]);
        gdprocess.on('message', function(message) {
          eventEmitter.emit('newinfos', message);
        });
    });
  }

  this.restartprocess = function(){
    gdprocess.kill('SIGHUP');
    console.log('kill');
    this.createprocess();
  }
}

module.exports = ProccessHandle;
