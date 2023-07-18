const mail = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const database = require("./db");
require("dotenv").config();
exports.result = (request,response)=>{
    let form_data = "";
    request.on("data",(chunks)=>{
    form_data += chunks.toString();
    });

    request.on("end",()=>{
        const receipt = JSON.parse(form_data);
        const secret = crypto.randomBytes(16).toString("hex");
      const insert_res =  database.insertOne({
            secret : secret,
            created_at : new Date(),
            isVerified : false,
        },"jwt_secret");
       insert_res.then((success_res)=>{
         const secret_id =   success_res.data.insertedId;
    const token = jwt.sign({
        iss : "http://localhost:8080/api/sendmail",
        data : {
            email : receipt.email
        }
    },secret,{expiresIn:900});
    const link = `http://localhost:8080/profile?token=${token}&secretId=${secret_id}&verify=${receipt.id}`;
      console.log(receipt.id);
      const auth = mail.createTransport({
        service : "gmail",
        auth : {
            user : process.env.admin_email_username,
            pass : process.env.admin_email_password
        }
    });
    
    const mail_option = {
        from : "7mdkarimul@gmail.com",
        to : receipt.email,
        subject : receipt.subject,
        html : `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Document</title>
        </head>
        <body style="
            background:#f2f2f2;
            padding:32px 0
        ">
            <div style="
              width: 580px;
              padding: 32px;
              background: white;
              box-shadow: 0 0 10px #ddd;
              margin: 32px auto
            ">
              <center>
                <img src="https://www.searchpng.com/wp-content/uploads/2019/01/Myntra-logo-png-icon-715x715.png" width="100">
                <h1 style="font-family: sans-serif">Verification Required !</h1>
                <p style="
                  font-family: calibri;
                  font-size: 18px;
                  letter-spacing: 1px
                ">
                  To complete your profile activation, we just need to verify your email address
                </p>
                <button style="
                  padding: 13px 20px;
                  border: none;
                  background: #bf00ff;
                  color: white;
                  border-radius: 4px;
                  margin-top: 16px;
                  box-shadow: 0 0 5px #ddd
                "><a href="${link}" style="color:white;text-decoration:none">VERIFY NOW</a></button>
              </center>
        
            </div>
        </body>
        </html>
        `
    };
    auth.sendMail(mail_option,(error,email_res)=>{
       console.log(email_res);
    });


}).catch((error_res)=>{
       console.log(error_res);
       });
    });

 response.write("Success !");
 return response.end();
}