 const query = require('querystring');
 const jwt = require("jsonwebtoken");
exports.result = (request,response)=>{
    let formdata = "";

    request.on("data",(chunks)=>{
   formdata += chunks.toString();
    });

    request.on("end",()=>{
        //console.log(query.parse(formdata));
        const post = query.parse(formdata);
       // console.log(post.token);
       if(post.token && post.token !="")
       {
       //verify token
         jwt.verify(post.token,"1234",(error,success)=>{
             if(success)
             {
             console.log("success");
             }
             else
             {
                const message = JSON.stringify({
                    isVerify : false,
                    message : "Token not verified !"
                });
                 sendResponse(response,401,message);
             }
         });
       }
       else
       {
          const message = JSON.stringify({
              isVerify : false,
              message : "Unauthenticated user !"
          });
           sendResponse(response,404,message);
       }
    });


   const sendResponse = (response,s_code,message)=>{
      response.writeHead(s_code,{
          'Content-Type' : 'application/json'
      });
      response.write(message);
      return response.end();
   }
}