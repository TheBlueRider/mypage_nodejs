

function SocketHandle(server, eventEmitter) {
  this.createsocket = function(){
    var io = require('socket.io')(server);
    var infohistory = null;
    var pointhistory = null;

    io.sockets.on('connection', function (socket) {
       console.log('Un client est connecté !');
       if (infohistory != null) {
         console.log('send info history');
         socket.emit('newinfos', infohistory);
       }
       if (pointhistory != null) {
         console.log('send point history');
         socket.emit('positionclose', pointhistory);
       }
       eventEmitter.on('newinfos', function (message) {
           socket.emit('newinfos', message);
           infohistory = message;
       });

       eventEmitter.on('positionclose', function (message) {
           socket.emit('positionclose', message);
           pointhistory = message;
       });
    });
  }
}


module.exports = SocketHandle;
