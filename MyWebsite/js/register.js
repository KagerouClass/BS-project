function checkRegister(user_name, password, email)
{  
    if(checkEmail(email) && checkUsername(user_name) && checkPassword(password))
    {  
         return true;  
    }          
    return false;  
}  
function checkUsername(user_name)
{  
    if(user_name.value.length!=0)
    {  
        return true;  
    }
    else{  
        alert("请输入用户名");  
        return false;  
    }  
}   
function checkPassword(password)
{  
    if(password.value.length!=0)
    {  
        return true;  
    }
    else
    {  
        alert("请输入密码");  
        return false;  
    }  
}
function checkEmail(email)
{  
    if(email.value.length!=0)
    {  
        var regEXP = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        if(!regEXP.test(email.value))
        {
            alert("邮箱地址不合法！");
            return false;
        }
        return true;  
    }
    else
    {  
        alert("请输入注册邮箱");  
        return false;  
    }  
}
function register(user_name, password, email){
    if(true == checkRegister(user_name, password, email))
    {
        $.ajax({
            //type: "post",
            data: "register_req&" + document.getElementById("user_name").value+"&"+document.getElementById("password").value+"&"+document.getElementById("email").value,
            url: 'http://127.0.0.1:5426',
            async:false,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "successConnect_jsonpCallback",
        }).done(function (res) 
        {
            if(res === "success") 
            {
                alert("注册成功！现在请使用刚才注册的账户登陆");
                window.location.href = 'login.html';
            }
            else if(res == "user_duplicate")
            {
                alert("该用户名已存在！");
            }
            else if(res == "email_duplicate")
            {
                alert("该邮箱已注册！");
            }
        });
        return true;
    }
    else
    {
        return false;
    }
}