var price = 'none';
//var socket = io.connect('https://bluerider-haochenyao.rhcloud.com:8443');
var socket = io.connect('http://localhost:8082');
socket.on('newinfos', function(message) {
  var value_total = 0;
  var different_total = 0;
  var index = 0;
  $('#stock_table tr').each(function() {
    var stock_id = $(this).find(".stockid").html();
    if (stock_id != undefined && message[index] != undefined) {
      $(this).find(".stockname").html(message[index][0]);
      $(this).find(".priceyesclose").html(message[index][2]);
      $(this).find(".pricetodopen").html(message[index][1]);
      $(this).find(".pricenow").html(message[index][3] + "(" +
          ((parseFloat(message[index][3])-parseFloat(message[index][2]))/parseFloat(message[index][2])*100).toFixed(2)
          + "%)");
      if (parseFloat(message[index][3]) < parseFloat(message[index][2]))
        $(this).find(".pricenow").css("color", "green");
      else if (parseFloat(message[index][3]) > parseFloat(message[index][2]))
        $(this).find(".pricenow").css("color", "red");
      else
        $(this).find(".pricenow").css("color", "black");
      var value = parseFloat(message[index][3]) * parseFloat($(this).find(".numberbuy").html()) / 10000;
      var difference = (parseFloat(message[index][3])
                        - parseFloat($(this).find(".pricebuy").html()))
                        * parseFloat($(this).find(".numberbuy").html())/10000;
      value_total += value;
      different_total += difference;
      $(this).find(".value").html(value.toFixed(1)+'('+difference.toFixed(1)+')');
      if (difference < 0)
        $(this).find(".value").css("color", "green");
      else if (difference > 0)
        $(this).find(".value").css("color", "red");
      index++;
    }
  });

  $("#value_total").html(value_total.toFixed(1)+'('+different_total.toFixed(1)+')');
  if (different_total < 0)
    $("#value_total").css("color", "green");
  else if (different_total > 0)
    $("#value_total").css("color", "red");
});

socket.on('positionclose', function(message) {
  var index = 0;
  $('#stock_table tr').each(function() {
    var stock_id = $(this).find(".stockid").html();
    if (stock_id != undefined && message[index] != undefined) {
      $(this).find(".positionclose").html(message[index]);
      index++;
    }
  });
});

function removestock(href) {
  var ok = confirm("确认删除");
  loadingbegin();
  if (ok) {
    loadingfinish();
    window.location.href = href;
  }
}
