var StockDAO = require('../stock').StockDAO;

function ProccessHandle(db, eventEmitter) {
  var stocks = new StockDAO(db);
  var childprocess = require('child_process');

  this.createprocess = function(){
    stocks.getAllStocks(function(err, results) {
        "use strict";
        if (err) { console.log("error occured when execute mongo query"); return; }
        var stockstring = '';

        for (var index= 0; index < results.length; index++)
        {
          stockstring += 'sh'+results[index]['stock_id']+',';
        }

        var gdprocess = childprocess.fork(__dirname + '/getdata.js', [stockstring]);
        gdprocess.on('message', function(message) {
          eventEmitter.emit('newprice', message);
        });

    });
  }
}

module.exports = ProccessHandle;
