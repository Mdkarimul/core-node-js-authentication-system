const { promise } = require("bcrypt/promises");
const mongo = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";
const objectId = require("mongodb").ObjectId;


//establish connection 
const config = ()=>{
    return new Promise((resolve,reject)=>{
        mongo.connect(url,(error,conn)=>{
            const db = conn.db("nodewap");
           const collection =  db.collection("users");
           resolve(db);
               });
    });
}

//fetch or find data
exports.find = (query,collection_name)=>{
    return new Promise((resolve,reject)=>{
        config().then((db)=>{
            db.collection(collection_name).find(query).toArray((error,data_res)=>{
            //console.log(data_res);
            if(data_res.length !=0)
            {
            resolve({
            status_code : 200,
            data : data_res,
            message : "Match found !"
            });
            }
            else
            {
                reject({
                    status_code:404,
                    message : "Data not found !"
                });
            }
            });
            });
    });
};

exports.find_by_id = (id,collection_name)=>{
    return new Promise((resolve,reject)=>{
        config().then((db)=>{
            db.collection(collection_name).find({"_id":objectId(id)}).toArray((error,data_res)=>{
            //console.log(data_res);
            if(data_res.length !=0)
            {
            resolve({
            status_code : 200,
            data : data_res,
            message : "Match found !"
            });
            }
            else
            {
                reject({
                    status_code:404,
                    message : "Data not found !"
                });
            }
            });
                });
    });
};

//insert data
exports.insertOne = (userInfo,collection_name)=>{
    //console.log(userInfo);
    return new Promise((resolve,reject)=>{
   config().then((db)=>{
       db.collection(collection_name).insertOne(userInfo,(error,data_res)=>{
           if(error)
           {
               reject({
                   status_code : 500,
                   message : "Internal server error !"
               });
           }else
           {
               resolve({
                   status_code : 200,
                   data : data_res,
                   message : "Data inserted !"
               });
           }
       });
   });
    });

};

//update data
exports.updateById = (id,form_data,collection_name)=>{
    console.log(id);
return new promise((resolve,reject)=>{
   config.then((db)=>{
       db.collection(collection_name).updateOne({"_id":{ObjectId:id}},form_data,(error,data_res)=>{
        if(error)
        {
            reject({
                status_code : 500,
                message : "Internal server error !"
            });
        }else
        {
            resolve({
                status_code : 201,
                data : data_res,
                message : "Data updated !"
            });
        }

       });
   });
});
}