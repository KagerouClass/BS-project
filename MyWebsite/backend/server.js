var http        = require('http');
var querystring = require('querystring');
var mysql       = require('mysql');
var fs          = require('fs');
var wordMapObj = new Map();
var file = './wordlist/TOEFL_word_list.json';
var request = JSON.parse(fs.readFileSync(file));
for (i in request){
  var x = request[i].word;
  var y = request[i].explanation;
  wordMapObj.set(x,y);
}
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
//start the server

function handle(data, res)
{
  if(data[1]=="login_req") 
  {
    user_name = data[2];
    password  = data[3];
    querySentence = 'SELECT user_name,password,email FROM user_information WHERE user_name=\''+user_name+'\'';
    var isLegalUser = false;
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
            querySentence = 'SELECT count(1) as count FROM user_information';
            connection.query(querySentence, function (error, results, fields) {
              if (error) throw error;
              querySentence = 'insert into user_information values (\''+(results[0].count+1)+'\','+'\''+user_name+'\','+'\''+password+'\','+'\''+email+'\')';
                connection.query(querySentence, function (error, results, fields) {
                  if (error) throw error;
                  res.writeHead(200, {'Content-Type': 'application/json'});
                  res.end('successConnect_jsonpCallback(' + JSON.stringify('success')+ ')');
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
}
http.createServer((req, res) =>
{
  handle(req.url.split('&'), res);
}).listen(5426);
console.log('Server running at http://127.0.0.1:5426/');
