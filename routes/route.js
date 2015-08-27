var ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler;

function RoutesHandle(app, db, eventEmitter) {
    var contentHandler = new ContentHandler(db, eventEmitter);

    app.get('/', contentHandler.displayMainPage);
    app.get('/me', contentHandler.displayPresentPage);
    app.get('/mystocks', contentHandler.displayStocksPage);
    app.get('/candlestick/:stock_id', contentHandler.displayCandlestick);
    app.get('/newstock', contentHandler.displayNewStockPage);
    app.post('/newstock', contentHandler.handleNewStock);

    app.get('/myfamilly', contentHandler.displayFamillyPage);
    app.get('/remove/:stock_id', contentHandler.removeStockPage);
    app.get('/trade/:stock_id', contentHandler.tradeStockPage);
    app.post('/trade/:stock_id', contentHandler.handleTradeStock);

    app.get('/histories', contentHandler.displayHistoriesPage);
    app.get('/tradecallback/:history_id', contentHandler.tradeCallBack);

    app.get('/map', contentHandler.displayMapPage);

    app.get('/animation/first', contentHandler.displayFirstAnimationPage);
    app.get('/baobao', contentHandler.cadeaubaobao);
    // Error handling middleware
    app.use(ErrorHandler);
}

module.exports = RoutesHandle;
