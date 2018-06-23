$('.button-collapse').sideNav({
    draggable: true // Choose whether you can drag to open on touch screens
  }
);
var user_name = "";
var review_current_page = 0;
var previous_ans = -1;
var rightAnsNum = 0;
var choice = new Array(4);
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
    getReviewPage();
  }); // end of document ready
})(jQuery); // end of jQuery name space
function toBookHomepage()
{
  window.location.href = 'bookhomepage.html?' + user_name;
}
function toUserWordBook()
{
  window.location.href = 'userwordbook.html?' + user_name;
}
function toTest()
{
  window.location.href = 'test.html?' + user_name;
}
function toProcess()
{
  window.location.href = 'process.html?' + user_name;
}
function toUserWordBook()
{
  window.location.href = 'userwordbook.html?' + user_name;
}
function getReviewPage()
{
  $.ajax({
    //type: "post",
    data: "test_req&" + user_name +"&"+review_current_page+"&"+previous_ans,
    url: 'http://127.0.0.1:5426',
    async:false,
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "testPageGetSuccess_jsonpCallback"
  }).done(function (res) 
  {
    console.log(res);
    var index = 0;
    var response = new String(res);
    var word = "";
    choice = new Array(4);
    review_current_page++;
    if(response.indexOf('&')==-1)
    {
      document.getElementById("content").innerHTML = "<h3>本次复习回答正确的单词数量为"+res+"个</h3>"+"<a href=\"javascript:toBookHomepage();\" id=\"download-button\" class=\"btn-large waves-effect waves-light orange\">返回主页</a>\"";
    }
    else
    {
      word = response.substr(index, response.indexOf('&', index)-index);
      index = response.indexOf('&', index)+1;
      for(var i = 0; i<4; ++i)
      {
        choice[i] = response.substr(index, response.indexOf('&', index)-index);
        index = response.indexOf('&', index)+1;
      }
      rightAnsNum = parseInt(response.substr(index, response.length-index));
      document.getElementById("word").innerText = word;
      document.getElementById("choice-1").innerText = choice[0];
      document.getElementById("choice-2").innerText = choice[1];
      document.getElementById("choice-3").innerText = choice[2];
      document.getElementById("choice-4").innerText = choice[3];
      document.getElementById("review-process").innerText = review_current_page+" / 5";
    }
    
  });
}
function setAns(ans)
{
  previous_ans=ans;
  if(rightAnsNum == ans)
  {
  }
  else
  {
    alert("很遗憾，本单词正确意思为："+choice[rightAnsNum]);
  }
  getReviewPage();
}