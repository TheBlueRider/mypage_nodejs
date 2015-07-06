/* The PostsDAO must be constructed with a connected database object */
function StockDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof StockDAO)) {
        console.log('Warning: StockDAO constructor called without "new" operator');
        return new StockDAO(db);
    }

    var stocks = db.collection("stocks");

    this.insertEntry = function (stock_id, callback) {
        "use strict";
        console.log("inserting stock: " + stock_id);

        // Build a new stock
        var stock = {"stock_id": 'sh'+stock_id,
                "create_date": new Date()}

        // now insert the stock
        stocks.insert(stock, function (err, result) {
            "use strict";

            if (err) return callback(err, null);

            console.log("Inserted new stock");
            callback(err, stock_id);
        });
    }

    this.getStockDetail = function(stock_id, callback) {
        "use strict";
        stocks.findOne({"stock_id": stock_id}, function(err, result) {
            if (err) return callback(err, null);


            if (result) {
              console.log("Stock found");
              callback(err, result);
            } else {
              callback(err, null);
            }
        });
    }

    this.getAllStocks = function(callback) {
        "use strict";

        stocks.find({}).toArray(function(err, items) {
            "use strict";
            console.log(err);
            if (err) return callback(err, null);

            console.log("Found " + items.length + " stocks");

            callback(err, items);
        });
    }

    this.removeStock = function(stock_id, callback) {
        "use strict";
        stocks.remove({"stock_id": stock_id}, function(err, numberOfRemovedDocs) {
        assert.equal(null, err);
        assert.equal(1, numberOfRemovedDocs);
      });
    }
}

module.exports.StockDAO = StockDAO;
