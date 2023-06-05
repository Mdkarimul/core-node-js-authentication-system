
const { error } = require("console");
const database = require("./db");
const bcrypt = require("bcrypt");

exports.result = (request,response)=>{
    let form_data = "";
    request.on("data",(chunks)=>{
form_data += chunks.toString();
    });
//get data when chunks is completed !
request.on("end",()=>{
    const userInfo = JSON.parse(form_data);
    const query = {
        email : userInfo.email
    };
const find_res =  database.find(query,"users");
find_res
.then((success_res)=>{
send_res(response,success_res.status_code,success_res);
})
.catch((error_res)=>{
    //new user try to proceed the signup
    bcrypt.hash(userInfo.password.toString(),10).then((encrypted_pass)=>{
    userInfo['password'] = encrypted_pass;
    userInfo['created_at'] = new Date();
    userInfo['updated_at'] = new Date();
    userInfo['email_verified'] = false;
    userInfo['mobile_verified'] = false;
    createUser(userInfo);
    });
});
});

const createUser = (userInfo)=>{
const insert_res = database.insertOne(userInfo,"users");
insert_res
.then((success_res)=>{
    send_res(response,success_res.status_code,success_res);
})
.catch((error_res)=>{
    send_res(response,success_res.status_code,error_res);
});
};

//send response
const send_res = (response,status_code,res_message)=>{
  response.writeHead(status_code,{
      "Content-Type" : "application/json"
  });
  response.write(JSON.stringify(res_message));
  return response.end();
}
}