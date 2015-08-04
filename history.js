
var mongodb = require('mongodb');

function HistoryDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof HistoryDAO)) {
        console.log('Warning: HistoryDAO constructor called without "new" operator');
        return new HistoryDAO(db);
    }

    var histories = db.collection("histories");

    this.insertEntry = function (stock_id, type, price_trade, number_trade, stock, callback) {
        "use strict";
        console.log("inserting history: " + stock_id);
        var price_buy = 0;
        if (stock['price_buy'] != null)
        {
          price_buy = stock['price_buy'];
        }
        var history = {"history_id": '_' + Math.random().toString(36).substr(2, 9),
                "stock_id": stock_id,
                'type' : type,
                'price_trade' : price_trade,
                'number_trade' : number_trade,
                'price_buy' : price_buy,
                "create_date": new Date()}
        histories.insert(history, function (err, result) {
          if (err) return callback(err, null);
        });
    }

    this.getAllHistories = function(callback) {
        "use strict";

        histories.find({}).sort({create_date:-1}).toArray(function(err, items) {
            "use strict";
            if (err) return callback(err, null);

            callback(err, items);
        });
    }

    this.isTheLast = function(history_id, callback) {
        "use strict";
        var historyCursor = histories.find({}).sort({create_date:-1}).limit(1);
        historyCursor.each(function(err, history) {
          if (err) return callback(err, null);
          if (history != null) {
            if (history.history_id != history_id) {
              return callback(err, false, history)
            }
            else {
              return callback(err, true, history);
            }
          }
        });
    }

    this.getHistory = function(history_id, callback) {
        "use strict";
        histories.findOne({'history_id': history_id}, function(err, result) {
            if (err) return callback(err, null);
            if (result) {
              callback(err, result);
            } else {
              callback(err, null);
            }
        });
    }


    this.removeHistory = function(history_id, callback) {
        "use strict";
        histories.remove({'history_id': history_id}, function(err, numberOfRemovedDocs) {
          if (err) return callback(err, null);
            callback(err, numberOfRemovedDocs);
        });
    }

    this.removeStockHistory = function(stock_id, callback) {
      "use strict";
      histories.remove({'stock_id': stock_id}, function(err, numberOfRemovedDocs) {
        if (err) return callback(err, null);
          callback(err, numberOfRemovedDocs);
      });
    }
}

module.exports.HistoryDAO = HistoryDAO;
