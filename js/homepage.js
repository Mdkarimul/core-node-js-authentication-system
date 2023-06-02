window.onload = ()=>{
signupRequest();
remember_me();
showUser();
autoLogin();
}

const signupRequest  = ()=>{
    const form = document.querySelector("#signup-form");
    form.onsubmit = (e)=>{
        e.preventDefault();
        //get form data
        const form_data = JSON.stringify({
            name : document.querySelector("#name").value,
            email : document.querySelector("#email").value,
            mobile : document.querySelector("#mobile").value,
            password : document.querySelector("#password").value
        });
        //ajax request 
        const ajax = new XMLHttpRequest();
        ajax.open("POST","http://localhost:8080/api/signup",true);
        ajax.send(form_data);
        //show loader 
        ajax.onreadystatechange = ()=>{
         if(ajax.readyState==2)
         {
             $(".loader").removeClass("d-none");
         }
        }
        //get response
        ajax.onload = ()=>{
            //hide loader
            $(".loader").addClass("d-none");
           const  data  = JSON.parse(ajax.response);
           if(data.message.toLowerCase()=="match found !")
           {
          show_message("User already exit !","fa fa-exclamation-circle mr-1","red");
           }else
           {
            form.reset();
            show_message("Signup success !","fa fa-check-circle mr-1","#34A853");
           }
        }
    }
}

const remember_me = ()=>{
    const form = document.querySelector("#login-form");
    form.onsubmit = (e)=>{
    e.preventDefault();
    const checkbox = document.querySelector("#remember-me");
    const login_email = document.querySelector("#login-email").value;
    const login_password = document.querySelector("#login-password").value;
    const user = JSON.stringify({
        email : login_email,
        password : login_password
    });
    if(checkbox.checked)
    {
  localStorage.setItem("user",user);
  login_request(user);
    }
    else
    {
   login_request(user);
    }
    } 
}

const login_request = (user)=>{
const api_url = "http://localhost:8080/api/login";
const ajax = new XMLHttpRequest();
ajax.open("POST",api_url,true);
ajax.send(user);
//show loader
ajax.onreadystatechange = ()=>{
    if(ajax.readyState==2)
    {
        $(".loader").removeClass("d-none");
    }
}
//get response
ajax.onload = ()=>{
  //hide loader
  $(".loader").addClass("d-none");
  const response = JSON.parse(ajax.response);
  if(response.isLoged)
{
    console.log(response.token);
    //login success
  const is_verified =   verifyToken(response.token,api_url);
  if(is_verified)
  {
      alert("Verified !");
      //store verified token in localstorage
      localStorage.setItem("__token",response.token);
      localStorage.setItem("__secret_id",response.secret_id);
      window.location = "/profile?token="+response.token+"&secretId="+response.secret_id;
  }
  else
  {
   show_message("Authentication failed !","fa fa-exclamation-circle mr-1","red");
  }
}
else
{
    show_message(response.message,"fa fa-exclamation-circle mr-1","red");
}
}
}

const verifyToken = (token,api_url)=>{
 const jwt =  JSON.parse(atob(token.split(".")[1]));
 if(jwt.iss==api_url)
 {
return true;
 }
 else
 {
return false;
 }
}

const showUser = ()=>{
    if(localStorage.getItem("user") != null)
    {
        const user = JSON.parse(localStorage.getItem("user"));
        const login_email = document.querySelector("#login-email");
        const login_password = document.querySelector("#login-password");
        const checkbox = document.querySelector("#remember-me");
        login_email.value = user.email;
        login_password.value = user.password;
        checkbox.checked = true;
    }
}

const show_message = (message,class_value,color)=>{
    $(".toast-title").css({color:color});
    $("i",".toast-title").removeClass();
    $("i",".toast-title").addClass(class_value);
    $(".toast").toast("show");
    $(".toast").addClass("animate_animated animate_slideInRight");
    $(".toast-body").html(message);
};

const autoLogin = ()=>{
    if(localStorage.getItem("__token") != null && localStorage.getItem("__secret_id") != null)
    {
  const token = localStorage.getItem("__token");
  const secret_id = localStorage.getItem("__secret_id");
  window.location = "/profile?token="+token+"&secretId="+secret_id;
    }
}