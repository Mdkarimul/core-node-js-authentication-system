const database = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
exports.result =(request,response)=>{
    let form_data = "";
    const full_url = request.headers.referer+request.url.slice(1);
    request.on("data",(chunks)=>{
  form_data += chunks.toString();
    });
    request.on("end",()=>{
    const user = JSON.parse(form_data);
    const query = {
        email : user.email
    };
   const find_res =  database.find(query,"users");
   find_res.then((success_res)=>{
       const userInfo = success_res;
     const realpassword =   userInfo.data[0].password;
     //match encrypted password
     bcrypt.compare(user.password,realpassword)
     .then((isMatched)=>{
         if(isMatched==true)
         {
           //login success generate secrets and create token!
          const secret = crypto.randomBytes(16).toString("hex");
       const insert_res =    database.insertOne({
              secret : secret,
              created_at : new Date(),
              isVerified : false
          },"jwt_secret");
          insert_res.then((success_res)=>{
              const secret_id = success_res.data._id.toString();
              const token =  jwt.sign({
                iss : full_url,
                data : userInfo.data[0]
            },secret,{expiresIn:86400});
            const message = JSON.stringify({
                isLoged : true,
                message : "User authenticated !",
                token : token,
                secret_id  : secret_id
            });
            sendResponse(response,200,message);
          }).catch((error_res)=>{
         const message = JSON.stringify({
            isLoged : false,
           message : "authentication failed !"
       });
       sendResponse(response,401,message);
          });
         }else
         {
             //login failed !
             const message = JSON.stringify({
                 isLoged : false,
                message : "authentication failed !"
            });
            sendResponse(response,401,message);
         }
     });
   })
   .catch((error_res)=>{
  const message = JSON.stringify({
      isLoged : false,
      message : "User not found !"
  });
  sendResponse(response,404,message);
   });
    });


    const sendResponse = (response,status_code,message)=>{
        response.writeHead(status_code,{
            "Content-Type" : "application/json"
        });
        response.write(message);
        return response.end();
    }

    
}