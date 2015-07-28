
function UpdateHandle(db, eventEmitter) {
  this.createlistener = function() {
    eventEmitter.on('newinfos', function (message) {
      var stockCursor = db.collection("stocks").find();
      var index = 0;
      var pointlist = [];
        // Grab the first object again
      stockCursor.each(function(err, stock) {
        var updatequery = {};
        if (stock != null) {
          updatequery['_id'] = stock._id;
          var pricenow = message[index][3];
          var priceyesclose = message[index][2];
          // you were missing the surrounding {}
          var point = stock.point;
          var priceprecedent = stock.preprice;
          if (point == null || priceprecedent == null)
            point = message[index][3]*0.85;
          else {
            if (point > priceyesclose)
              point = point + (pricenow - priceprecedent) * 0.3;
            else
              point = point + (pricenow - priceprecedent) * 0.5;
          }
          point = point.toFixed(2);
          pointlist.push(point);
          var update = { $set: { point: point, priceprecedent: pricenow} };
            // obviously you want to replace field1 and field2 with your actual field names

            // instead of creating a new update object and using $set
            // you could also just modify the 'doc' variable and pass it again
            // in the update function below instead of myupdate

          index++;
          db.collection('stocks').update(updatequery, update, function (err, updatedDoc) {
             if (err) throw err;
           });
         }
         else {
           eventEmitter.emit('positionclose', pointlist);
         }
      });
    });
  }
}

module.exports = UpdateHandle;
