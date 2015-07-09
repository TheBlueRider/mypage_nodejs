var ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db) {
    var contentHandler = new ContentHandler(db);

    // The main page of the blog
    app.get('/', contentHandler.displayMainPage);

    app.get('/mystocks', contentHandler.displayStocksPage);
    // The main page of the blog, filtered by tag
    app.get('/newstock', contentHandler.displayNewStockPage);
    app.post('/newstock', contentHandler.handleNewStock);
    //app.get('/baobao', contentHandler.cadeaubaobao);
    app.get('/baobao', contentHandler.commingsoon);
    // Error handling middleware
    app.use(ErrorHandler);
}
