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
    toPage(1);
  }); // end of document ready
})(jQuery); // end of jQuery name space
function toPage(pageNumber)
{
  var user_name = window.location.href.split('?')[1].split('=')[1];
  var insertHtml = "";
  var totalPage = 0;
  var totalWord = 0;
  $.ajax({
    //type: "post",
    data: "bookWordNum_req&" + user_name,
    url: 'http://127.0.0.1:5426',
    async:false,
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "bookWordNumSuccess_jsonpCallback"
  }).done(function (res) 
  {
    if(res == "no-word")
    {
      insertHtml = "<ul class=\"pagination\">"+
          "<li class=\"disabled\"><i class=\"material-icons\">chevron_left</i></a></li>"+
          "<li class=\"disabled\"><i class=\"material-icons\">chevron_right</i></a></li>"+
          "</ul>";
      document.getElementById("page").innerHTML = insertHtml;
      alert("现在单词本中没有单词！");
    }
    else
    {
      if(res%5==0)
        totalPage = res/5;
      else
        totalPage = (res-res%5)/5+1;
      totalWord = res;
      insertHtml = "<ul class=\"pagination\">";
      if(pageNumber == 1)
        insertHtml += "<li class=\"disabled\"><i class=\"material-icons\">chevron_left</i></a></li>";
      else
        insertHtml += "<li class=\"waves-effect\"><a href=\"javascript:toPage("+(pageNumber-1)+");\"><i class=\"material-icons\">chevron_left</i></a></li>";
      var i = 1;
      for(i = 1; i < pageNumber; ++i)
        insertHtml += "<li class=\"waves-effect\"><a href=\"javascript:toPage("+i+");\">"+i+"</a></li>";
      insertHtml += "<li class=\"active\"><a href=\"javascript:toPage("+pageNumber+");\">"+pageNumber+"</a></li>";
      ++i;
      for(; i <= totalPage; ++i)
        insertHtml += "<li class=\"waves-effect\"><a href=\"javascript:toPage("+i+");\">"+i+"</a></li>";
      if(pageNumber == totalPage)
        insertHtml += "<li class=\"disabled\"><i class=\"material-icons\">chevron_right</i></a></li>";
      else
        insertHtml += "<li class=\"waves-effect\"><a href=\"javascript:toPage("+(pageNumber+1)+");\"><i class=\"material-icons\">chevron_right</i></a></li>";
      document.getElementById("page").innerHTML = insertHtml; 
      $.ajax({
        //type: "post",
        data: "book_req&" + user_name + "&" + pageNumber,
        url: 'http://127.0.0.1:5426',
        async:false,
        dataType: "jsonp",
        jsonp: "callback",
        jsonpCallback: "bookSuccess_jsonpCallback"
      }).done(function (res) 
      {
        console.log(res);
      });  
      
    }
  });
  
  
    
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