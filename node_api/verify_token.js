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
        console.log(post);
        if(post.token && post.token !="")
        {
        const secret_id = post.secretId;
       const find_res =  database.find_by_id(secret_id,"jwt_secret");
       find_res.then((success_res)=>{
           const secret = success_res.data[0].secret;
           //console.log(success_res);
        //verify the token
    jwt.verify(post.token,secret,(error,success)=>{
        if(success)
        {
            if(post.verify)
            {
                const id = post.verify;
                const form_data  = {
                    $set : {                        
                     email_verified : true
                    }
                };

                database.updateById(id,form_data,"users");

            }
       const message = JSON.stringify({
        isVerified : true,
        message : "Token  verified !"
    });

    send_response(response,200,message);
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
           console.log(error_res);
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