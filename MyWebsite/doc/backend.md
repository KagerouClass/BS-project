前端防注入措施：

禁止在输入框内输入分号`;`。

前端如何向后端发送请求：

1. 设计一个JS函数，调用AJAX向`127.0.0.1:5426`发送数据，并且在done后响应返回数据。根据返回的数据内容决定前端是否要使用`window.location.href `跳转。

后端搭建步骤：

1. 安装Windows使用的Node JS；

2. 使用http://www.runoob.com/nodejs/nodejs-http-server.html下的hello world例程，输入`node server.js`执行，服务后端成功跑了起来，并且通过浏览器访问`127.0.0.1:5426`可以看见页面显示hello world；

3. 输入命令`npm install mysql`安装驱动；

4. 修改http://www.runoob.com/nodejs/nodejs-mysql.html下的连接例程，输入`node server.js`执行，发现出现异常。查询google后发现是驱动不支持mysql最新的password hash algorithm，所以需要在数据库中手工执行查询，每个新数据库用户（不是单词本用户）似乎都需要执行一次该操作。

   ```sql
    ALTER USER '3150105426'@'localhost' IDENTIFIED WITH mysql_native_password BY '3150105426'
   ```

   