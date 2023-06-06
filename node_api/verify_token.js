const query = require("querystring");
const jwt = require("jsonwebtoken");
const database = require("./db");
exports.result = (request,response)=>{
    let form_data = "";
    request.on("data",(chunks)=>{
        form_data += chunks.toString();
    });

    request.on("end",()=>{
        const post = query.parse(form_data);
        if(post.token && post.token !="")
        {
        const secret_id = post.secretId;
       const find_res =  database.find_by_id(secret_id,"jwt_secret");
       find_res.then((success_res)=>{
        const secret = success_res.data[0].secret;
        //verify the token
    jwt.verify(post.token,secret,(error,success)=>{
        if(success)
        {
            if(post.token)
            {
                const userData = JSON.parse(atob(post.token.split(".")[1]));
                const id = userData.data._id;
    
                const form_data  = {
                    $set : {                        
                     email_verified : true
                    }
                };

          const check_update =   database.updateById(id,form_data,"users");
          check_update.then((data_res)=>{
           if(data_res.modifiedCount){
            console.log(data_res);
            const message = JSON.stringify({
                isVerified : true,
                message : "Token  verified !"
            });
            send_response(response,200,message);
           }else{
            console.log("lari");
            const message = JSON.stringify({
                isVerified : true,
                message : "Token  verified !"
            });
            send_response(response,200,message);
           }
          });
            }
        }else
        {
            const message = JSON.stringify({
                isVerified : false,
                message : "Token not verified !"
            });
            send_response(response,401,message);
        }
    });
       }).catch((error_res)=>{
           console.log(error_res.message);
           send_response(response,error_res.status_code,error_res.message);
       });
        }
        else
        {
            const message = JSON.stringify({
                isVerified : false,
                message : "Unauthenticated user !"
            });
            send_response(response,401,message);
        }
    });
   const  send_response = (response,status_code,message)=>{
  response.writeHead(status_code,{
      "Content-Type" : "application/json"
  });
  response.write(message);
  return response.end();
   }
}