    require("dotenv").config();
const http = require("http");
const nodemailer = require("nodemailer");
const fs = require("fs");

console.log(process.env.email_id);
const { notStrictEqual } = require("assert");


//mail coding 
const email = (message,response)=>{
    const auth =  nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.email_id,
            pass : process.env.email_pwd
        }
    });
    
    const receipt = {
        from :'7mdkarimul@gmail.com',
        to : '7mdkarimul@gmail.com',
        subject : "Verification code",
        html : message,
        attachments : [
            {
                f_name :"demo.jpg",
                content  : fs.createReadStream("assets/test.jpg")
            },
            {
                f_name : "demo.pdf",
                content : fs.createReadStream("assets/notes.pdf")
            }
        ]
    };
    
    auth.sendMail(receipt,(error,email_res)=>{
        if(error)
        throw error;
        console.log("mail send !");
        response.end();
    
    });
};




const server = http.createServer((request,response)=>{
fs.readFile("template.html",(error,message)=>{
  email(message,response);
});

});

server.listen(8080);