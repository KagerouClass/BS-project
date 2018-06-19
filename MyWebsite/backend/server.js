var nextpage = 
'<html><head></head>' +
'<body>' +
'<a href="D:/GitHub/BS-project/MyWebsite/register.html" id="register">这里</a>' +
'</body></html>';

var http = require('http');
var querystring = require('querystring');
var user_name;
var password;
var querySentence; 
var mysql      = require('mysql');
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
http.createServer(function (req, res) 
{
  var body = "";
  req.on('data', function (chunk) 
  {
    body += chunk;
  });
  req.on('end', function () 
  {
    body = querystring.parse(body);
    
    if(body.user_name && body.password) 
    {
      user_name = body.user_name;
      password  = body.password;
      querySentence = 'SELECT user_name,password FROM user_information WHERE user_name=\''+user_name+'\'';
      var isLegalUser = false;
      connection.query(querySentence, function (error, results, fields) {
        if (error) throw error;
        if(results[0])
        {
          if(results[0].password == password)
          {
            isLegalUser = true;
            res.writeHead(200, {'Content-Type': 'application/json'});
            let json = JSON.stringify('success');
            res.end(json);
          }
          else
          {
            console.log('The user is illegal');
            res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
            res.end();
            //res.write("password wrong");
          }
        }
        else
        {
          console.log('The user is not existed');
          res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
          res.end();
          //res.write("account not exits");
        }
      });
    } 
    else
    {
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf8'});
      res.end();
    }
    
  });
}).listen(5426);

console.log('Server running at http://127.0.0.1:5426/');
