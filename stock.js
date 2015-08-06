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

    this.insertEntry = function (stock_id, price_buy, number_buy, market_code, callback) {
        "use strict";
        console.log("inserting stock: " + stock_id);
        var query = {"stock_id" : stock_id};
        stocks.find(query).toArray(function(err, result) {
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

            stock['market'] = market_code;
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

        stocks.find({}).sort({create_date : 1}).toArray(function(err, items) {
            "use strict";
            if (err) return callback(err, null);

            callback(err, items);
        });
    }

    this.upadatestock = function(stock_id, type, price_trade, number_trade, callback) {
      if (type != 0) {
        var findquery = {"stock_id": stock_id};
        var stockCursor = db.collection("stocks").find(findquery).limit(1);
        stockCursor.each(function(err, stock) {
          var updatequery = {};
          if (stock != null) {
            updatequery['_id'] = stock['_id'];
            var nb = stock.number_buy;
            var pb = stock.price_buy;
            if (nb == null)
              nb = 0;
            if (pb == null)
              pb = 0;
            var number_now = parseFloat(nb) + parseFloat(type) * parseFloat(number_trade);
            if (number_now < 0)
              return callback(err, 'NaN', stock);
            var price_cost = 0
            if (number_now > 0)
              price_cost = (parseFloat(nb) * parseFloat(pb) + parseFloat(price_trade) * parseFloat(number_trade) * parseFloat(type)) / number_now;
            if (type < 0)
              price_cost = parseFloat(pb);
            var update = { $set: { number_buy : number_now,
                                  price_buy : price_cost} };
            stocks.update(updatequery, update, function (err, updatedDoc){
              if (err) return callback(err, 'error', null);
              callback(err, 'OK', updatedDoc);
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

    this.tradecallback = function(history, callback) {
        "use strict";
        var stock_id = history['stock_id'];
        var number_trade = parseFloat(history['number_trade']);
        var price_trade = parseFloat(history['price_trade']);
        var type = parseFloat(history['type']);
        stocks.findOne({"stock_id": stock_id}, function(err, result) {
            if (err) return callback(err, null);
            if (result) {
              var updatequery = {};
              updatequery['_id'] = result._id;
              var number_buy = parseFloat(result['number_buy']);
              var price_buy = parseFloat(result['price_buy']);
              var numbercallback = number_buy - type * number_trade;
              if (numbercallback.toFixed(0) < 0)
                return callback(new Error('数据错误'));

              var pricecallback = 0;
              if (numbercallback != 0)
              {
                pricecallback = (number_buy * price_buy - type * number_trade * price_trade) / numbercallback;
                if (type == -1) {
                  var profit = (price_buy - price_trade) * number_trade;
                  pricecallback = (number_buy * price_buy + profit + number_trade * price_trade) / numbercallback;
                }
              }
              var update = { $set: { number_buy: numbercallback, price_buy: pricecallback} };
              stocks.update(updatequery, update, function (err, updatedDoc){
                if (err) return callback(err, null);
                callback(err, updatedDoc);
              });
            } else {
              callback(err, null);
            }
        });
    }
}

module.exports.StockDAO = StockDAO;
