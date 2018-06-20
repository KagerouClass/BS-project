$('.button-collapse').sideNav({
    draggable: true // Choose whether you can drag to open on touch screens
  }
);
var user_name = "";
var wordReadyAdd = "";
var explanation = "";
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
  }); // end of document ready
})(jQuery); // end of jQuery name space
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
function toProcess()
{
  window.location.href = 'process.html?' + user_name;
}
function checkWord(word)
{  
    if(word.value.length!=0)
    {  
        return true;  
    }
    else
    {  
        alert("请输入单词");  
        return false;  
    }  
}
function searchWord(word){
  if(true == checkWord(word))
  {
      $.ajax({
          //type: "post",
          data: "wordSearch_req&" + document.getElementById("word").value,
          url: 'http://127.0.0.1:5426',
          async:false,
          dataType: "jsonp",
          jsonp: "callback",
          jsonpCallback: "successSearch_jsonpCallback",
      }).done(function (res) 
      {
        if(res == "word_does_not_exit")
        {
          alert("该单词在本单词本中不存在");
        }
        else
        {
          var insertHtml = "<input type=\"submit\" id=\"login-button\" class=\"waves-effect waves-light btn\" value=\"是否将该单词加入词汇本？\" name=\"submit\" onclick=\"return addWordToBook();\"/>"
          wordReadyAdd = document.getElementById("word").value;
          explanation  = res;
          document.getElementById("explanation").innerText = res;
          document.getElementById("confirmButton").innerHTML = insertHtml;
        }
      });
      return true;
  }
  else
  {
      return false;
  }
}
function addWordToBook(){
  var user_name = window.location.href.split('?')[1].split('=')[1];
  $.ajax({
    //type: "post",
    data: "addWordToBook_req&" + user_name + "&" + wordReadyAdd + "&" + explanation,
    url: 'http://127.0.0.1:5426',
    async:false,
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "successAddToBook_jsonpCallback",
  }).done(function (res) 
  {
    if(res == "success")
    {
      alert("该单词已经成功加入单词本中");
      window.location.href = 'userwordbook.html?user_name=' + user_name;
    }
    else if(res == "duplicate")
    {
      alert("该单词已经存在于单词本中");
    }
  });
  return true;
}