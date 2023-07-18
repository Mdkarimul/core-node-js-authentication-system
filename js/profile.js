//const { use } = require("bcrypt/promises");

window.onload =()=>{
    verify_token();
    logout();
    verifyNown();
}

const verify_token = ()=>{
    const data = location.href.split("?");
    const ajax = new XMLHttpRequest();
    ajax.open("POST","http://localhost:8080/api/verifyToken");
    ajax.send(data[1]);
    //get response
    ajax.onload = ()=>{
      const response =   JSON.parse(ajax.response);
      console.log(response.token);
      sessionStorage.setItem("username",user.data.email);
      if(response.isVerified)
      {
    const user = getUserInfo();
    console.log(user);
    sessionStorage.setItem("username",user.data.email);
    if(user.data.email_verified)
    {
      alert("v");
     //email id already verified !
     $(".loader").addClass("d-none");
     $(".profile-page").removeClass("d-none");
    }
    else
    {
      alert("not");
    //email id not verified ! send verification code
    $(".loader").addClass("d-none");
    $(".profile-page").addClass("d-none");
    $(".email-notice").removeClass("d-none");
    const receipt = JSON.stringify({
      id  : user.data._id,
      email : user.data.email,
      subject : "Nodewap email verification",
      message : "To complete your profile activation , we just need to verify your email address !",
      token : localStorage.getItem("__token")
    });
    send_email_verification_link(receipt);
    }
      }
      else
      {
          localStorage.removeItem("__token");
          localStorage.removeItem("__secret_id")
          window.location = "http://localhost:8080";
      }
    }

}

const getUserInfo = ()=>{
 const token =  localStorage.getItem("__token");
const user =  JSON.parse(atob(token.split(".")[1]));
return user;
}

const send_email_verification_link = (receipt)=>{
  const ajax = new XMLHttpRequest();
  ajax.open("POST","http://localhost:8080/api/sendmail",true);
  ajax.send(receipt);
  //get response
  ajax.onload = ()=>{
    console.log(ajax.response);
  }
};


const logout = ()=>{
  const logout_btn = document.querySelector("#logout-btn");
  logout_btn.onclick = ()=>{
      //remove token and secretId from localstorage
      localStorage.removeItem("__token");
      localStorage.removeItem("__secret_id");

      //redirect 
      window.location = "http://localhost:8080";
  }
}

const verifyNown = ()=>{
  const verify_btn = document.querySelector("#verify-now");
  verify_btn.onclick = ()=>{
    const email = sessionStorage.getItem("username");
     const email_server = email.split("@")[1];
     window.close();
     verify_token();
     alert(email_server);
     window.location = `https://${email_server}`;
    // https://mail.google.com/mail/u/0/#inbox
  }
}

