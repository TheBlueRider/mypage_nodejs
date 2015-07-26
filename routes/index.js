var ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db, eventEmitter) {
    var contentHandler = new ContentHandler(db, eventEmitter);

    app.get('/', contentHandler.displayMainPage);
    app.get('/index', contentHandler.displayIndexPage);
    app.get('/mystocks', contentHandler.displayStocksPage);
    app.get('/candlestick/:stock_id', contentHandler.displayCandlestick);
    app.get('/newstock', contentHandler.displayNewStockPage);
    app.post('/newstock', contentHandler.handleNewStock);
    app.get('/myfamilly', contentHandler.displayFamillyPage)
    //app.get('/baobao', contentHandler.cadeaubaobao);
    app.get('/baobao', contentHandler.cadeaubaobao);
    // Error handling middleware
    app.use(ErrorHandler);
}
