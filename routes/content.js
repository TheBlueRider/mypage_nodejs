var StockDAO = require('../stock').StockDAO
  , HistoryDAO = require('../history').HistoryDAO
  , sanitize = require('validator').sanitize
  , mongodb = require('mongodb'); // Helper to sanitize form input

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db, eventEmitter) {
    "use strict";

    var stocks = new StockDAO(db);
    var histories = new HistoryDAO(db);

    this.displayMainPage = function(req, res, next) {
        "use strict";
        return res.render('index', {});
    }

    this.displayIndexPage = function(req, res, next) {
        "use strict";
        return res.render('present', {});
    }

    this.displayStocksPage = function(req, res, next) {
        "use strict";
        //console.log("Cookies: ", req.cookies);
        stocks.getAllStocks(function(err, results) {
            "use strict";

            if (err) return res.render('error_template', {err:err});

            return res.render('mystocks', {
                title: 'mystocks',
                  mystocks: results
            });
        });
    }

    this.displayCandlestick = function(req, res, next) {
      "use strict"

      var stock_id = req.params.stock_id;
      return res.render('candlestick', {
          stock_id: 'sh'+stock_id
      });
    }

    this.displayStockDetailPage = function(req, res, next) {
        "use strict";

        stocks.getStockDetail(function(err, result) {
            "use strict";

            if (err) return res.render('error_template', {err:err});

            return res.render('stock_detail', {
                title: 'mystocks',
                mystocks: result
            });
        });
    }

    this.removeStockPage = function(req, res, next) {
        "use strict";
        var stock_id = req.params.stock_id;
        stocks.removeStock(stock_id, function(err, numberOfRemovedDocs) {
            "use strict";

            if (err) return res.render('error_template', {err:err});

            return res.redirect('/mystocks');
        });

        histories.removeStockHistory(stock_id, function(err, numberOfRemovedDocs) {
            "use strict";
            if (err) console.log(err);
        });
    }

    this.handleTradeStock = function(req, res, next) {
      "use strict";
      var price_trade = req.body.price_trade;
      var trade_type = req.body.trade_type;
      var number_trade = req.body.number_trade;
      var stock_id = req.params.stock_id;
      var type = 0;
      if (trade_type === '卖出')
        type = -1;
      else if (trade_type === '买入')
        type = 1;


      stocks.getStock(stock_id, function(err, result) {
          "use strict";
          if (isNaN(price_trade)) {
              var errors = "价格必须是数字";
              return res.render('tradestock', {
                  stock: result,
                  err: errors
              });
          }


          if (isNaN(number_trade)) {
              var errors = "数量必须是数字";
              return res.render('tradestock', {
                  stock: result,
                  err: errors
              });
          }

          if (err) return res.render('error_template', {err:err});

          histories.insertEntry(stock_id, type, price_trade, number_trade, result, function(err, callbackinfo) {
            "use strict";
            if (err) return res.render('error_template', {err:err});
          });

          stocks.upadatestock(stock_id, type, price_trade, number_trade, function(err, info, valuereturn) {
            if (err) return res.render('error_template', {err:err});
            if (info == 'NaN') {
              return res.render('tradestock', {
                  stock: valuereturn,
                  err: '卖出数量大于已有数量'
              });
            }
            return res.redirect('/mystocks');
          });
      });
    }

    this.tradeStockPage = function(req, res, next) {
      "use strict";
      var stock_id = req.params.stock_id;
      stocks.getStock(stock_id, function(err, result) {
          "use strict";

          if (err) return res.render('error_template', {err:err});
          return res.render('tradestock', {
              stock: result
          });
      });
    }

    this.displayNewStockPage = function(req, res, next) {
      "use strict";
      return res.render("newstock", {});
    }

    this.displayFamillyPage = function(req, res, next) {
      "use strict";
      return res.render("myfamilly", {});
    }

    this.handleNewStock = function(req, res, next) {
        "use strict";

        var stock_id = req.body.stock_id;
        var price_buy = req.body.price_buy;
        var number_buy = req.body.number_buy;
        var market = req.body.market;
        var market_code = "sh";

        if (!stock_id) {
            var errors = "请输入股票代码";
            return res.render("newstock", {err: errors});
        }

        if (isNaN(price_buy)) {
            var errors = "价格必须是数字";
            return res.render("newstock", {err: errors});
        }


        if (isNaN(number_buy)) {
            var errors = "数量必须是数字";
            return res.render("newstock", {err: errors});
        }
        console.log(market);
        if (market == "深证股")
        {
          market_code = "sz";
        }
        stocks.insertEntry(stock_id, price_buy, number_buy, market_code,  function(err, callbackinfo) {
            "use strict";
            if (err) return next(err);
            if (callbackinfo == 'exist') {
              return res.render("newstock", {err: "股票已经存在于数据库"});
            }
            eventEmitter.emit('newstock', 'newstock');
            return res.redirect("/mystocks");
            // now redirect to the blog permalink
        });

    }

    this.displayFirstAnimationPage = function(req, res, next) {
        "use strict"
        return res.render("animationhtml5", {});
    }

    this.cadeaubaobao = function(req, res, next) {
        "use strict";
        return res.render("cadeau", {});
    }

    this.displayHistoriesPage = function(req, res, next) {
        "use strict";
        histories.getAllHistories(function(err, results) {
            "use strict";

            if (err) return res.render('error_template', {err:err});

            return res.render('myhistories', {
                myhistories: results
            });
        });
    }

    this.tradeCallBack = function(req, res, next) {
        "use strict";
        var history_id = req.params.history_id;
        histories.isTheLast(history_id, function(err, isthelast, history) {
            "use strict";
            if (err) return res.render('error_template', {err:err});
            if (!isthelast)
              return res.redirect('/histories');
            else {

              stocks.tradecallback(history, function(err, callbackinfo) {
                "use strict";
                if (err) return res.render('error_template', {err:err});
              });

              histories.removeHistory(history_id, function(err, results) {
                "use strict";
                if (err) return res.render('error_template', {err:err});
                  return res.redirect('/histories');
              });
            }
        });
    }
}

module.exports = ContentHandler;
