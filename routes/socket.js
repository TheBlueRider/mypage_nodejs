

function SocketHandle(server, eventEmitter) {
  this.createsocket = function(){
    var io = require('socket.io')(server);
    io.sockets.on('connection', function (socket) {
       console.log('Un client est connecté !');
       eventEmitter.on('newprice', function (message) {
           socket.emit('newprice', message);
       });
    });
  }
}


module.exports = SocketHandle;
