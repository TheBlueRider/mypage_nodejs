var request = require('request');
var utf8 = require('utf8');
var iconv = require('iconv-lite');


getdata();
setInterval(getdata, 12000);

function getdata() {
  "use strict"
  var stockstring = process.argv[2];
  request.get({
    uri:'http://hq.sinajs.cn/list='+stockstring,
    encoding: null
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var stocksinfo = [];
      var bodydecode = iconv.decode(body, 'GBK');
      bodydecode = bodydecode.replace(/\"/g, "");
      var stocklist=bodydecode.split(";");
      for (var index= 0; index < stocklist.length-1; index++)
      {
          var jsonvalue=stocklist[index].split("=");
          var elements=jsonvalue[1].split(",");
          stocksinfo.push(elements);
      }
      process.send(stocksinfo);
    }
  })
}
