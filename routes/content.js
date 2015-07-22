var StockDAO = require('../stock').StockDAO
  , sanitize = require('validator').sanitize; // Helper to sanitize form input

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db, eventEmitter) {
    "use strict";

    var stocks = new StockDAO(db);

    this.displayMainPage = function(req, res, next) {
        "use strict";
        return res.render('index', {});
    }

    this.displayIndexPage = function(req, res, next) {
        "use strict";
        return res.render('present', {});
    }

    this.gestionstock = function(req, res, next) {
      "use strict"
      console.log("commencer de gerer stock");
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


    this.displayNewStockPage = function(req, res, next) {
      "use strict";
      return res.render("newstock", {});
    }


    this.handleNewStock = function(req, res, next) {
        "use strict";

        var stock_id = req.body.stock_id;
        var price_buy = req.body.price_buy;
        var number_buy = req.body.number_buy;

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

        stocks.insertEntry(stock_id, price_buy, number_buy,  function(err, callbackinfo) {
            "use strict";
            if (err) return next(err);
            if (callbackinfo == 'exist') {
              console.log('return newstock');
              return res.render("newstock", {err: "股票已经存在于数据库"});
            }
            eventEmitter.emit('newstock', 'newstock');
            // now redirect to the blog permalink
            return res.redirect("/mystocks");
        });
    }


    this.cadeaubaobao = function(req, res, next) {
        "use strict";
        return res.render("cadeau", {});
    }



    this.commingsoon = function(req, res, next) {
        "use strict";
        return res.render("comming", {});
    }
}

module.exports = ContentHandler;
