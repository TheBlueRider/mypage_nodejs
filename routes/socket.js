

function SocketHandle(server, eventEmitter) {
  this.createsocket = function(){
    var io = require('socket.io')(server);
    var messagehistory=null;
    io.sockets.on('connection', function (socket) {
       console.log('Un client est connecté !');
       if (messagehistory != null) {
         console.log('send history');
         socket.emit('newinfos', messagehistory);
       }
       eventEmitter.on('newinfos', function (message) {
           socket.emit('newinfos', message);
           messagehistory = message;
       });
    });
  }
}


module.exports = SocketHandle;
