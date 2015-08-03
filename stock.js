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

    this.insertEntry = function (stock_id, price_buy, number_buy, callback) {
        "use strict";
        console.log("inserting stock: " + stock_id);
        var query = {"stock_id" : stock_id};
        stocks.find(query).toArray(function(err, result) {
          console.log(result.length);
          if (result.length != 0)
            return callback(err, 'exist');
          else {
            // Build a new stock
            var stock = {"stock_id": stock_id,
                    "create_date": new Date()}
            if (price_buy != "")
              stock['price_buy'] = price_buy;

            if (number_buy != "")
              stock['number_buy'] = number_buy;

            // now insert the stock
            stocks.insert(stock, function (err, result) {
                "use strict";

                if (err) return callback(err, null);

                console.log("Inserted new stock");
                callback(err, stock_id);
            });
          }
        });
    }

    this.getStock = function(stock_id, callback) {
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
            if (err) return callback(err, null);

            callback(err, items);
        });
    }

    this.upadatestock = function(stock_id, type, price_trade, number_trade, callback) {
      if (type != 0) {
        var findquery = {"stock_id": stock_id};
        var stockCursor = db.collection("stocks").find(findquery);
        stockCursor.each(function(err, stock) {
          var updatequery = {};
          if (stock != null) {
            updatequery['_id'] = stock['_id'];
            var number_now = parseFloat(stock.number_buy) + parseFloat(type) * parseFloat(number_trade);
            if (number_now < 0) number_now = 0;
            var price_cost = 0
            if (number_now > 0)
              price_cost = ((parseFloat(stock.number_buy) * parseFloat(stock.price_buy) + parseFloat(price_trade) * parseFloat(number_trade) * parseFloat(type)) / number_now).toFixed(2);
            if (type < 0)
              price_cost = parseFloat(stock.price_buy);
            var update = { $set: { number_buy : number_now,
                                  price_buy : price_cost} };
            console.log(update);
            stocks.update(updatequery, update, function (err, updatedDoc){
              if (err) return callback(err, null);
              callback(err, updatedDoc);
            });
          }
        });
        
      }
    }

    this.removeStock = function(stock_id, callback) {
        "use strict";
        stocks.remove({"stock_id": stock_id}, function(err, numberOfRemovedDocs) {
          if (err) return callback(err, null);
            callback(err, numberOfRemovedDocs);
        });
    }
}

module.exports.StockDAO = StockDAO;
