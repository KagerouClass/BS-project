$('.button-collapse').sideNav({
    draggable: true // Choose whether you can drag to open on touch screens
  }
);
var user_name = "";
var is_this_word_book_complete = false;
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
    getWord();
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
function toUserWordBook()
{
  window.location.href = 'userwordbook.html?' + user_name;
}
function learnComplete(flag)
{
  var user_name = window.location.href.split('?')[1].split('=')[1];
  if(false == is_this_word_book_complete)
  {
    $.ajax({
      //type: "post",
      data: "memorycomplete_req&" + user_name,
      url: 'http://127.0.0.1:5426',
      async:false,
      dataType: "jsonp",
      jsonp: "callback",
      jsonpCallback: "memoryCompleteSuccess_jsonpCallback"
    }).done(function (res) 
    {
  
    });
  }
  else
  {
  }
  if(0==flag)
    window.location.href = 'bookhomepage.html?user_name=' + user_name;
  else if(1==flag)
    getWord();
}
function getWord()
{
  var user_name = window.location.href.split('?')[1].split('=')[1];
  $.ajax({
    //type: "post",
    data: "memorywords_req&" + user_name,
    url: 'http://127.0.0.1:5426',
    async:false,
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "memorywordsGetSuccess_jsonpCallback"
  }).done(function (res) 
  {
    if(res == "this_word_book_complete")
    {
      is_this_word_book_complete = true;
      alert("恭喜您已背完本词汇书");
      document.getElementById("next-10").innerHTML ="";
      window.location.href = 'bookhomepage.html?user_name=' + user_name;
    }
    else
    {
      var index = 0;
      var response = new String(res);
      for(var i = 0; i < 10; ++i)
      {
        var word = response.substr(index, response.indexOf('&', index)-index);
        index = response.indexOf('&', index)+1;
        var explanation = response.substr(index, response.indexOf('&', index)-index);
        index = response.indexOf('&', index)+1;
        document.getElementById("word-"+(i+1)).innerHTML = word;
        document.getElementById("explanation-"+(i+1)).innerHTML = "<p>"+explanation+"</p>";
      }
    }
  });
}