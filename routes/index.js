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
    // Error handling middleware
    app.use(ErrorHandler);
}
