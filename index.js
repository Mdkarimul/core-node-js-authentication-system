const http = require("http");
const fs = require("fs");
const signup = require("./node_api/signup");
const login = require("./node_api/login");
const verify_token = require("./node_api/verify_token");
const sendMail = require("./node_api/send_mail");
const { sign } = require("crypto");

const route = (path,response,status_code,type)=>{
    fs.readFile(path,(error,data)=>{
     if(data)
     {
        response.writeHead(status_code,{
            "Content-Type" : type
        });
   response.write(data);
   return  response.end();
     }
     else
     {
        response.writeHead(404,{
            "Content-Type" : "text/html"
        });
   response.write("File not found !");
 return  response.end();
     }
    });
}
const server = http.createServer((request,response)=>{
    //--html page routing ! -->
    if(request.url=="/")
    {
        //response.write(request.url);
        var path = "html/homepage.html";
        var type ="text/html";
        var status_code = 200;
       route(path,response,status_code,type);
    }
    else if(request.url=="/about-us" || request.url=="/about")
    {
        var path = "html/about_us.html";
        var status_code = 200;
        var type = "text/html";
       route(path,response,status_code,type);
    }
    else if(request.url=="/contact" || request.url=="/contact-us")
    {
        var path = "html/contact_us.html";
        var status_code = 200;
        var type = "text/html";
       route(path,response,status_code,type);
    }
    else if(request.url=="/profile")
    {
        var path = "html/profile.html";
        var status_code = 200;
        var type = "text/html";
       route(path,response,status_code,type);
    }
    // css page routing 
    else if(request.url=="/css/homepage.css")
    {
        var path = "css/homepage.css";
        var status_code =200;
        var type = "text/css";
        route(path,response,status_code,type); 
    }

    else if(request.url=="/css/about_us.css")
    {
        var path = "css/about_us.css";
        var status_code =200;
        var type = "text/css";
        route(path,response,status_code,type); 
    }

    else if(request.url=="/css/contact_us.css")
    {
        var path = "css/contact_us.css";
        var status_code =200;
        var type = "text/css";
        route(path,response,status_code,type); 
    }

    else if(request.url=="/css/not_found.css")
    {
        var path = "css/not_found.css";
        var status_code =200;
        var type = "text/css";
        route(path,response,status_code,type); 
    }

    else if(request.url=="/css/profile.css")
    {
        var path = "css/profile.css";
        var status_code =200;
        var type = "text/css";
        route(path,response,status_code,type); 
    }

    //java script page routing !
    else if(request.url=="/js/homepage.js")
    {
        var path = "js/homepage.js";
        var status_code =200;
        var type = "text/js";
        route(path,response,status_code,type); 
    }

    else if(request.url=="/js/about_us.js")
    {
        var path = "js/about_us.js";
        var status_code =200;
        var type = "text/js";
        route(path,response,status_code,type); 
    }

    else if(request.url=="/js/contact_us.js")
    {
        var path = "js/contact_us.js";
        var status_code =200;
        var type = "text/js";
        route(path,response,status_code,type); 
    }

    else if(request.url=="/js/not_found.js")
    {
        var path = "js/not_found.js";
        var status_code =200;
        var type = "text/js";
        route(path,response,status_code,type); 
    }

    else if(request.url=="/js/profile.js")
    {
        var path = "js/profile.js";
        var status_code =200;
        var type = "text/js";
        route(path,response,status_code,type); 
    }
    //node api's routing
    else if(request.url=="/api/signup" && request.method=="POST")
    {
    signup.result(request,response);
    }
    else if(request.url=="/api/login" && request.method=="POST")
    {
    login.result(request,response);
    }
    else if(request.url=="/api/verifyToken" && request.method=="POST")
    {
    verify_token.result(request,response);
    }
    else if(request.url=="/api/sendmail" && request.method=="POST")
    {
    sendMail.result(request,response);
    }
    else
    {
        //authenticated route
        const reg_exp = {
            profile  : /\/profile\?token=/,
            images : /\/assets\/images\//,
            videos : /\/assets\/videos\//
        };
        if(reg_exp.profile.test(request.url))
        {
            var path = "html/profile.html";
            var status_code = 200;
            var type = "text/html";
           route(path,response,status_code,type);
        }
        else if(reg_exp.images.test(request.url))
        {
            var path = request.url.slice(1);
            var status_code = 200;
            var type = "image/jpeg";
           route(path,response,status_code,type);
        }
        else if(reg_exp.videos.test(request.url))
        {
            var path = request.url.slice(1);
            var status_code = 200;
            var type = "video/mp4";
           route(path,response,status_code,type);
        }
        else
        {
        var path = "html/not_found.html";
        var status_code = 404;
        var type = "text/html";
        route(path,response,status_code,type);  
        }
    }
   
}); 
server.listen(8080);