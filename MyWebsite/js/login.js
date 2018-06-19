function checkLogin(user_name, password)
{  
    if(checkUsername(user_name) && checkPassword(password))
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
function login(user_name, password){
    if(true == checkLogin(user_name, password))
    {
        $.ajax({
            //type: "post",
            data: "login_req&" + document.getElementById("user_name").value+"&"+document.getElementById("password").value,
            url: 'http://127.0.0.1:5426',
            async:false,
            dataType: "jsonp",
            jsonp: "callback",
            jsonpCallback: "successConnect_jsonpCallback",
        }).done(function (res) 
        {
            if(res === "success") 
            {
                window.location.href = 'bookhomepage.html?id=' + document.getElementById("user_name").value;
            }
            else if(res == "password_wrong")
            {
                alert("密码错误");
            }
            else if(res == "user_does_not_exist")
            {
                alert("此用户不存在");
            }
        });
        return true;
    }
    else
    {
        return false;
    }
}
