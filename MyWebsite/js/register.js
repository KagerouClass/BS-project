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
function checkEmail(email)
{  
    if(email.value.length!=0)
    {  
        return true;  
    }
    else
    {  
        alert("请输入注册邮箱");  
        return false;  
    }  
}