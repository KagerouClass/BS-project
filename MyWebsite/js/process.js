(function($){
  $(function(){

    $('.button-collapse').sideNav();
    displayResult(1932, 5426);
    var token = window.location.href.split('?');
    if(token.length > 1)
    {
      token = token[1].split('&');
      user_name = token[0];
      if(user_name.split('=')[0] !== "user_name") user_name ="";
      if(document.getElementById("user_name"))
        document.getElementById("user_name").innerText = window.location.href.split('?')[1].split('=')[1];
    }
  }); // end of document ready
})(jQuery); // end of jQuery name space
$('.button-collapse').sideNav({
    draggable: true // Choose whether you can drag to open on touch screens
  }
);
var user_name = "";
function displayResult(num, total){
  document.getElementById("progress-bar").style.width=calProcess(num, total);
  document.getElementById("progress-number").innerHTML=showProcess(num, total);
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
function toWordsReview()
{
  window.location.href = 'wordsreview.html?' + user_name;
}
function toTest()
{
  window.location.href = 'test.html?' + user_name;
} 