(function($){
  $(function(){

    $('.button-collapse').sideNav();
    var token = window.location.href.split('?');
    if(token.length > 1)
    {
      token = token[1].split('&');
      user_name = token[0];
      if(user_name.split('=')[0] !== "user_name") user_name ="";
      if(document.getElementById("user_name"))
        document.getElementById("user_name").innerText = window.location.href.split('?')[1].split('=')[1];
      
    }
    
    displayResult();
  }); // end of document ready
})(jQuery); // end of jQuery name space
$('.button-collapse').sideNav({
    draggable: true // Choose whether you can drag to open on touch screens
  }
);
var user_name = "";
function displayResult(){
  var user_name = window.location.href.split('?')[1].split('=')[1];
  $.ajax({
    //type: "post",
    data: "process_req&" + user_name,
    url: 'http://127.0.0.1:5426',
    async:false,
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "getProcessSuccess_jsonpCallback"
  }).done(function (res) 
  {
    var num = res;
    document.getElementById("progress-bar").style.width=calProcess(num, 4320);
    document.getElementById("progress-number").innerHTML=showProcess(num, 4320);
  });
}
function showProcess(num, total)
{  
  return num+"/"+total;
}  
function calProcess(num, total)
{  
  num = parseFloat(num); 
  total = parseFloat(total); 
  return total <= 0 ? "0%" : (Math.round(num / total * 10000) / 100.00 + "%"); 
} 
function toBookHomepage()
{
  window.location.href = 'bookhomepage.html?' + user_name;
}
function toUserWordBook()
{
  window.location.href = 'userwordbook.html?' + user_name;
}
function toWordsReview()
{
  window.location.href = 'wordsreview.html?' + user_name;
}
function toTest()
{
  window.location.href = 'test.html?' + user_name;
} 