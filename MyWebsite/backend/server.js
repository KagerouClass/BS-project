//first import everything we need
var http        = require('http');
var querystring = require('querystring');
var mysql       = require('mysql');
var fs          = require('fs');

//then get the word list
var testWordNum = 5;
var wordMapObj = new Map();
var word_ID_map = new Map();
var file = './wordlist/TOEFL_word_list.json';
var request = JSON.parse(fs.readFileSync(file));
var loopNum = 0;
for (i in request){
  var x = request[i].word;
  var y = request[i].explanation;
  wordMapObj.set(x,y);
  word_ID_map.set(loopNum,x);
  loopNum++;
}

//connect to database
var user_name;
var password;
var querySentence; 
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : '3150105426',
  password : '3150105426',
  port     : '3306',
  charset  : 'UTF8_GENERAL_CI',
  database : 'mywordbook_user'
});
connection.connect();

//status
var isTesting = false;
var isReviewing = false;
var isLearning = false;
var currentTestAtIndex = 0;
var testScore = 0;
var testWordList = new Array(testWordNum);
var testWordAns  = new Array(testWordNum);
var testRightAns = new Array(testWordNum);

//randomNumGen
function randomNum(minNum,maxNum)
{ 
  switch(arguments.length)
  { 
      case 1: 
          return parseInt(Math.random()*minNum+1,10); 
      break; 
      case 2: 
          return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
      break; 
          default: 
              return 0; 
          break; 
  } 
} 
function resetUserTestStudyReview()
{
  isTesting = false;
  isReviewing = false;
  isLearning = false;
  currentTestAtIndex = 0;
  testScore = 0;
  testWordList = new Array(testWordNum);
  testWordAns  = new Array(testWordNum);
  testRightAns = new Array(testWordNum);
}
//server function
function handle(data, res)
{
  if(data[1]=="login_req") 
  {
    user_name = data[2];
    password  = data[3];
    querySentence = 'SELECT user_name,password,email FROM user_information WHERE user_name=\''+user_name+'\'';
    resetUserTestStudyReview();
    connection.query(querySentence, function (error, results, fields) {
      if (error) throw error;
      if(results[0])
      {
        if(results[0].password == password)
        {
          isLegalUser = true;
          var email = results[0].email;
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end('successConnect_jsonpCallback(' + JSON.stringify('success')+ ')');
        }
        else
        {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end('successConnect_jsonpCallback(' + JSON.stringify('password_wrong')+ ')');
        }
      }
      else
      {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('successConnect_jsonpCallback(' + JSON.stringify('user_does_not_exist')+ ')');
      }
    });  
  } 
  else if(data[1] == "register_req")
  {
    user_name = data[2];
    password  = data[3];
    email     = data[4];
    querySentence = 'SELECT user_name FROM user_information WHERE user_name=\''+user_name+'\'';
    connection.query(querySentence, function (error, results, fields) {
      if (error) throw error;
      if(results[0])
      {
        if(results[0].user_name == user_name)
        {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end('successConnect_jsonpCallback(' + JSON.stringify('user_duplicate')+ ')');
        }
      }
      else
      {
        querySentence = 'SELECT email FROM user_information WHERE email=\''+email+'\'';
        connection.query(querySentence, function (error, results, fields) {
          if (error) throw error;
          if(results[0])
          {
            if(results[0].email == email)
            {
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end('successConnect_jsonpCallback(' + JSON.stringify('email_duplicate')+ ')');
            }
          }
          else
          {
            querySentence = 'CREATE TABLE \`mywordbook_user\`.\`'+user_name+'_book\` ('+
              '\`wordID\` INT NOT NULL,'+
              '\`word\` VARCHAR(255) NOT NULL,'+
              '\`meanning\` VARCHAR(255) NOT NULL,'+
              'PRIMARY KEY (\`wordID\`),'+
              'UNIQUE INDEX \`wordID_UNIQUE\` (\`wordID\` ASC) VISIBLE,'+
              'UNIQUE INDEX \`word_UNIQUE\` (\`word\` ASC) VISIBLE);';
            connection.query(querySentence, function (error, results, fields) {
              if (error) throw error;
            });
            querySentence = 'CREATE TABLE `mywordbook_user`.`'+user_name+'_worddate` ('+
              '`process` INT NOT NULL,'+
              '`date` DATE NOT NULL,'+
              'PRIMARY KEY (`process`));';
            connection.query(querySentence, function (error, results, fields) {
              if (error) throw error;
            });
            querySentence = 'SELECT count(1) as count FROM user_information';
            connection.query(querySentence, function (error, results, fields) {
              if (error) throw error;
              count = results[0].count;
              querySentence = 'insert into user_information values (\''+(results[0].count+1)+'\','+'\''+user_name+'\','+'\''+password+'\','+'\''+email+'\')';
                connection.query(querySentence, function (error, results, fields) {
                  if (error) throw error;
                  querySentence = 'insert into user_process values (\''+(count+1)+'\','+'\''+'0'+'\')';
                  connection.query(querySentence, function (error, results, fields) {
                    if (error) throw error;
                    res.writeHead(200, {'Content-Type': 'application/json'});
                    res.end('successConnect_jsonpCallback(' + JSON.stringify('success')+ ')');
                  });
              });
            });
          }
        });
      }
    });
    
  }
  else if(data[1] == "email_req") 
  {
    user_name = data[2];
    password  = data[3];
    querySentence = 'SELECT user_name,password,email FROM user_information WHERE user_name=\''+user_name+'\'';
    connection.query(querySentence, function (error, results, fields) {
      if (error) throw error;
      if(results[0])
      {
        var email = results[0].email;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('email_jsonpCallback(' + JSON.stringify(email)+ ')');
      }
    });  
  }
  else if(data[1] == "wordSearch_req") 
  {
    var word = data[2];
    var explanation = wordMapObj.get(decodeURI(word));
    if(explanation === undefined)
    {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end('successSearch_jsonpCallback(' + JSON.stringify("word_does_not_exit")+ ')');
    }
    else
    {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end('successSearch_jsonpCallback(' + JSON.stringify(explanation)+ ')');
    }
  }
  else if(data[1] == "addWordToBook_req") 
  {
    user_name = data[2];
    var wordReadyToAdd  = data[3];
    var explanation     = data[4];
    querySentence = 'SELECT word FROM '+user_name+'_book WHERE word=\''+wordReadyToAdd+'\'';
    connection.query(querySentence, function (error, results, fields) {
      if (error) throw error;
      if(results[0])
      {
        if(results[0].word == wordReadyToAdd)
        {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end('successAddToBook_jsonpCallback(' + JSON.stringify('duplicate')+ ')');
        }
      }
      else
      {
        querySentence = 'SELECT count(1) as count FROM ' +user_name+'_book';
        connection.query(querySentence, function (error, results, fields) {
          if (error) throw error;
          querySentence = 'insert into '+user_name+'_book values (\''+(results[0].count+1)+'\','+'\''+decodeURI(wordReadyToAdd)+'\','+'\''+decodeURI(explanation)+'\')';
          connection.query(querySentence, function (error, results, fields) {
            if (error) throw error;
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end('successAddToBook_jsonpCallback(' + JSON.stringify("success")+ ')');
          });
        });
      }
    });
  }
  else if(data[1] == "book_req") 
  {
    var user_name = data[2];
    var pageNumber = data[3];
    var currentPageWordNumber = 0;
    var response = "";
    querySentence = 'SELECT count(1) as count FROM ' +user_name+'_book';
    connection.query(querySentence, function (error, results, fields) {
      if (error) throw error;
      var totalPage = 0;
      if(results[0].count%5==0)
        totalPage = results[0].count/5;
      else
        totalPage = (results[0].count-results[0].count%5)/5+1;
      if(totalPage == pageNumber)
        currentPageWordNumber = results[0].count-5*(totalPage-1);
      else
        currentPageWordNumber = 5;
      response += currentPageWordNumber;
      
        var i= 1;
        querySentence = 'SELECT word FROM ' +user_name+'_book where wordID between '+(1+(pageNumber-1)*5)+' and '+(currentPageWordNumber+(pageNumber-1)*5);
        connection.query(querySentence, function (error, results, fields) {
          if (error) throw error;
          for(var i = 0; i < currentPageWordNumber; ++i)
          {
            response += "&";
            response += results[i].word;
          } 
          querySentence = 'SELECT meanning FROM ' +user_name+'_book where wordID between '+(1+(pageNumber-1)*5)+' and '+(currentPageWordNumber+(pageNumber-1)*5);
          connection.query(querySentence, function (error, results, fields) {
            if (error) throw error;
            for(var i = 0; i < currentPageWordNumber; ++i)
            { 
              response += "&";
              response += results[i].meanning;
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end('bookSuccess_jsonpCallback(' + JSON.stringify(response)+ ')');
          });
        });
        
    });
    
  }
  else if(data[1] == "bookWordNum_req") 
  {
    var user_name = data[2];
    querySentence = 'SELECT count(1) as count FROM ' +user_name+'_book';
    connection.query(querySentence, function (error, results, fields) {
      if (error) throw error;
      if(results[0].count == 0)
      {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('bookWordNumSuccess_jsonpCallback(' + JSON.stringify("no-word")+ ')');
      }
      else
      {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('bookWordNumSuccess_jsonpCallback(' + JSON.stringify(results[0].count)+ ')');
      }
    });
    
  }
  else if(data[1] == "test_req") 
  {
    var user_name = data[2];
    var page_num  = data[3];
    var previous_ans = data[4];
    if(previous_ans == testRightAns[page_num-1])
    {
      testScore++;
    }
    if(page_num == 0)
    {
      isTesting = false;
      testScore = 0;
      testWordList = new Array(testWordNum);
      testWordAns  = new Array(testWordNum);
      testRightAns = new Array(testWordNum);
    }
    if(page_num==testWordNum)
    {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end('testPageGetSuccess_jsonpCallback(' +JSON.stringify(testScore)+ ')');
      isTesting = false;
      testScore = 0;
      testWordList = new Array(testWordNum);
      testWordAns  = new Array(testWordNum);
      testRightAns = new Array(testWordNum);
    }
    else
    {
      if(!isTesting)
      {
        for(var i = 0; i < testWordNum; ++i)
        {
          var ID = randomNum(0, 4319);
          testWordList[i] = word_ID_map.get(ID);
          testWordAns[i] = new Array(4);
          var rightAnsIndex = randomNum(0, 3);
          testWordAns[i][rightAnsIndex]=wordMapObj.get(word_ID_map.get(ID));
          for(var j=0; j < 4; j++)
          {
            if(j != rightAnsIndex)
            {
              testWordAns[i][j]=wordMapObj.get(word_ID_map.get(randomNum(0, 4319)));
            }
          }
          testRightAns[i] = rightAnsIndex;
        }
        isTesting = true;
      }
      var response = "";
      response += testWordList[page_num] + "&";
      for(var i = 0; i < 4; ++i)
      {
        response += testWordAns[page_num][i] + "&";
      }
      response += testRightAns[page_num];
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end('testPageGetSuccess_jsonpCallback(' +JSON.stringify(response)+ ')');
      
    }
    
  } 
  else if(data[1] == "process_req")
  {
    var user_name = data[2];
    querySentence = 'SELECT UID FROM user_information WHERE user_name=\''+user_name+'\'';
    connection.query(querySentence, function (error, results, fields) {
      if (error) throw error;
      var UID = results[0].UID;
      querySentence = 'SELECT wordCompleteNum FROM user_process WHERE UID=\''+UID+'\'';
      connection.query(querySentence, function (error, results, fields) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end('getProcessSuccess_jsonpCallback(' + JSON.stringify(results[0].wordCompleteNum)+ ')');
      });
    });
  }
  else if(data[1] == "memorywords_req")
  {
    var user_name = data[2];
    querySentence = 'SELECT UID FROM user_information WHERE user_name=\''+user_name+'\'';
    connection.query(querySentence, function (error, results, fields) {
      if (error) throw error;
      var UID = results[0].UID;
      querySentence = 'SELECT wordCompleteNum FROM user_process where UID='+'\''+UID+'\'';
      connection.query(querySentence, function (error, results, fields) {
        if (error) throw error;
        var response = "";
        var wordCompleteNum = results[0].wordCompleteNum;
        if(wordCompleteNum == 4320)
        {
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end('memorywordsGetSuccess_jsonpCallback(' +JSON.stringify("this_word_book_complete")+ ')');  
        }
        else
        {
          for(var i = 0; i < 10; ++i)
          {
            response += word_ID_map.get(wordCompleteNum+i) + "&";
            response += wordMapObj.get(word_ID_map.get(wordCompleteNum+i)) + "&";
          }
          res.writeHead(200, {'Content-Type': 'application/json'});
          res.end('memorywordsGetSuccess_jsonpCallback(' +JSON.stringify(response)+ ')');  
        }
      });
    });
  }
  else if(data[1] == "memorycomplete_req")
  {
    var user_name = data[2];
    querySentence = 'SELECT UID FROM user_information WHERE user_name=\''+user_name+'\'';
    connection.query(querySentence, function (error, results, fields) {
      if (error) throw error;
      var UID = results[0].UID;
      querySentence = 'SELECT wordCompleteNum FROM user_process where UID='+'\''+UID+'\'';
      connection.query(querySentence, function (error, results, fields) {
        if (error) throw error;
        var wordCompleteNum = results[0].wordCompleteNum;
        querySentence = 'UPDATE user_process SET wordCompleteNum='+(wordCompleteNum+10)+' WHERE UID='+'\''+UID+'\'';
        connection.query(querySentence, function (error, results, fields) {
          if (error) throw error;
          var date = new Date();
          var nowMonth = date.getMonth() + 1;
          var strDate = date.getDate();
          var seperator = "-";
          if (nowMonth >= 1 && nowMonth <= 9) {
            nowMonth = "0" + nowMonth;
          }
          if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
          }
          var nowDate = date.getFullYear() + seperator + nowMonth + seperator + strDate;
          querySentence = 'INSERT INTO '+user_name+'_worddate values ('+(wordCompleteNum+10)+', '+'\''+nowDate+'\')';
          connection.query(querySentence, function (error, results, fields) {
            if (error) throw error;
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end('memoryCompleteSuccess_jsonpCallback(' +JSON.stringify("success")+ ')');
          });
        });
      });
    });
  }
  else if(data[1] == "review_req")
  {
    var user_name = data[2];
    var page_num  = data[3];
    var previous_ans = data[4];
    if(previous_ans == testRightAns[page_num-1])
    {
      testScore++;
    }
    if(page_num == 0)
    {
      isTesting = false;
      testScore = 0;
      testWordList = new Array(testWordNum);
      testWordAns  = new Array(testWordNum);
      testRightAns = new Array(testWordNum);
    }
    if(page_num==testWordNum)
    {
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end('reviewPageGetSuccess_jsonpCallback(' +JSON.stringify(testScore)+ ')');
      isTesting = false;
      testScore = 0;
      testWordList = new Array(testWordNum);
      testWordAns  = new Array(testWordNum);
      testRightAns = new Array(testWordNum);
    }
    else
    {
      if(!isTesting)
      {
        for(var i = 0; i < testWordNum; ++i)
        {
          var ID = randomNum(0, 4319);
          testWordList[i] = word_ID_map.get(ID);
          testWordAns[i] = new Array(4);
          var rightAnsIndex = randomNum(0, 3);
          testWordAns[i][rightAnsIndex]=wordMapObj.get(word_ID_map.get(ID));
          for(var j=0; j < 4; j++)
          {
            if(j != rightAnsIndex)
            {
              testWordAns[i][j]=wordMapObj.get(word_ID_map.get(randomNum(0, 4319)));
            }
          }
          testRightAns[i] = rightAnsIndex;
        }
        isTesting = true;
      }
      var response = "";
      response += testWordList[page_num] + "&";
      for(var i = 0; i < 4; ++i)
      {
        response += testWordAns[page_num][i] + "&";
      }
      response += testRightAns[page_num];
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.end('reviewPageGetSuccess_jsonpCallback(' +JSON.stringify(response)+ ')');
      
    }
  }
}

//start the server
http.createServer((req, res) =>
{
  handle(req.url.split('&'), res);
}).listen(5426);

//declare that the server is up
console.log('Server running at http://127.0.0.1:5426/');
