var StockDAO = require('../stock').StockDAO
  , sanitize = require('validator').sanitize; // Helper to sanitize form input

/* The ContentHandler must be constructed with a connected db */
function ContentHandler (db) {
    "use strict";

    var stocks = new StockDAO(db);


    this.displayMainPage = function(req, res, next) {
        "use strict";
        return res.render('index', {});
    }

    this.displayStocksPage = function(req, res, next) {
        "use strict";
        console.log("Cookies: ", req.cookies);
        stocks.getAllStocks(function(err, results) {
            "use strict";

            if (err) return res.render('error_template', {err:err});

            return res.render('mystocks', {
                title: 'mystocks',
                mystocks: results
            });
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

        if (!stock_id) {
            var errors = "Stock must contain a Stock_ID";
            return res.redirect("/newstock/");
        }

        stocks.insertEntry(stock_id,  function(err, stock_id) {
            "use strict";

            if (err) return next(err);

            // now redirect to the blog permalink
            return res.redirect("/mystocks/");
        });
    }


    this.cadeaubaobao = function(req, res, next) {
        "use strict";
        return res.render("cadeau", {});
    }
}

module.exports = ContentHandler;
