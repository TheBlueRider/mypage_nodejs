
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
        var history = {"stock_id": stock_id,
                'type' : type,
                'price_trade' : price_trade,
                'number_trade' : number_trade,
                'price_buy' : stock['price_buy'],
                "create_date": new Date()}
        histories.insert(history, function (err, result) {
          if (err) return callback(err, null);
        });
    }

    this.getAllHistories = function(callback) {
        "use strict";

        histories.find({}).sort({date:-1}).toArray(function(err, items) {
            "use strict";
            if (err) return callback(err, null);

            callback(err, items);
        });
    }

    this.isTheLast = function(history_id, callback) {
        "use strict";
        var historyCursor = histories.find({}).sort({date:-1}).limit(1);
        historyCursor.each(function(err, history) {
          if (err) return callback(err, null);
          if (history != null) {
            if (history._id != history_id) {
              return callback(err, 'n')
            }
            else {
              return callback(err, 'y');
            }
          }
        });
    }

    this.getHistory = function(history_id, callback) {
        "use strict";
        histories.findOne({'_id': new mongodb.ObjectID(history_id)}, function(err, result) {
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
        histories.remove({'_id': new mongodb.ObjectID(history_id)}, function(err, numberOfRemovedDocs) {
          if (err) return callback(err, null);
            callback(err, numberOfRemovedDocs);
        });
    }
}

module.exports.HistoryDAO = HistoryDAO;
