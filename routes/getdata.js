var request = require('request');
var utf8 = require('utf8');




setInterval(getdata, 12000);

function getdata() {
  "use strict"

  var stockstring = process.argv[2];
  request('http://hq.sinajs.cn/list='+stockstring, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var stocksprice = [];

      var stocklist=body.split(";");
      for (var index= 0; index < stocklist.length-1; index++)
      {

          var jsonvalue=stocklist[index].split("=");
          var elements=jsonvalue[1].split(",");
          stocksprice.push(elements[3]);
      }

      process.send(stocksprice);
    }
  })
}
