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
$.ajax({
    type: "post",
    data: "login_req&" + document.getElementById("user_name").value+"&"+document.getElementById("password").value,
    url: 'http://127.0.0.1:5426',
    async:false,
    dataType: "jsonp",
    jsonp: "callback",
    jsonpCallback: "success_jsonpCallback",
    success:function(msg){
        if (msg) 
        {
            window.location.href = '.../bookhomepage.html?user_name=' + document.getElementById("user_name").value;
        }
});