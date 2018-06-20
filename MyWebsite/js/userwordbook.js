$('.button-collapse').sideNav({
    draggable: true // Choose whether you can drag to open on touch screens
  }
);
var user_name = "";
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
          document.getElementById("explanation").innerText = res;
        }
      });
      return true;
  }
  else
  {
      return false;
  }
}