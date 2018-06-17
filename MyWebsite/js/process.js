(function($){
  $(function(){

    $('.button-collapse').sideNav();
    displayResult(1932, 5426);
  }); // end of document ready
})(jQuery); // end of jQuery name space
$('.button-collapse').sideNav({
    draggable: true // Choose whether you can drag to open on touch screens
  }
);
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