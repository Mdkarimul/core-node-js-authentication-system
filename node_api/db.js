const { promise } = require("bcrypt/promises");
const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
const client = new MongoClient(url,{family:4});
const objectId = require("mongodb").ObjectId;


//establish connection 
const config = ()=>{
    return new Promise((resolve,reject)=>{
        client.connect();
        const db = client.db("nodewap");
        resolve(db);
        // mongo.connect(url,(error,conn)=>{
        //     const db = conn.db("nodewap");
        //    const collection =  db.collection("users");
        //    resolve(db);
        //        });
    });
}

//fetch or find data
exports.find = (query,collection_name)=>{
    return new Promise((resolve,reject)=>{
        // resolve("karimul islam");
        config().then((db)=>{
        const data_res =  db.collection(collection_name).find(query).toArray();
            data_res.then((data)=>{
                if(data.length !=0)
                {
                resolve({
                status_code : 200,
                data : data,
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
}

exports.find_by_id = (id,collection_name)=>{
    return new Promise((resolve,reject)=>{
        config().then((db)=>{
           const data_res =  db.collection(collection_name).find({"_id": new objectId(id)}).toArray();
             data_res.then((data)=>{
              if(data){
                resolve({
            status_code : 200,
            data : data,
            message : "Match found !"
            });
              }else{
                reject({
                status_code:404,
                message : "Data not found !"
            });
              }
             })
            //     (error,data_res)=>{
            // console.log("data_res");
            // if(data_res.length !=0)
            // {
            // resolve({
            // status_code : 200,
            // data : data_res,
            // message : "Match found !"
            // });
            // }
            // else
            // {
            //     reject({
            //         status_code:404,
            //         message : "Data not found !"
            //     });
            // }
            // });
                });
    });
};

//insert data
exports.insertOne = (userInfo,collection_name)=>{
    //console.log(userInfo);
    return new Promise((resolve,reject)=>{
   config().then(async (db)=>{
      const insert_res = await db.collection(collection_name).insertOne(userInfo);
        if(insert_res.acknowledged){
           const inserted_data =  db.collection(collection_name).findOne({_id:insert_res.insertedId});
               if(inserted_data){
                inserted_data.then((insert_data)=>{
                    resolve({
                        status_code : 200,
                        data : insert_data,
                        message : "Data inserted !"
                    });
                   });
               }else{
                reject({
                    status_code : 500,
                    message : "Internal server error !"
                });
               }
           //     resolve({
        //     status_code : 200,
        //     data : insert_res,
        //     message : "Data inserted !"
        // });
        }else{
            reject({
                    status_code : 500,
                    message : "Internal server error !"
                });
        }
    //     userInfo,(error,data_res)=>{
    //        if(error)
    //        {
    //            reject({
    //                status_code : 500,
    //                message : "Internal server error !"
    //            });
    //        }else
    //        {
    //            resolve({
    //                status_code : 200,
    //                data : data_res,
    //                message : "Data inserted !"
    //            });
    //        }
    //    });
   });
    });

};

//update data
exports.updateById = (id,form_data,collection_name)=>{
return new Promise((resolve,reject)=>{
   config().then((db)=>{
      const update_response = db.collection(collection_name).updateOne({ _id:new objectId(id) },form_data);
       resolve(update_response);  
    //    (error,data_res)=>{
    //     if(error)
    //     {
    //         reject({
    //             status_code : 500,
    //             message : "Internal server error !"
    //         });
    //     }else
    //     {
    //         resolve({
    //             status_code : 201,
    //             data : data_res,
    //             message : "Data updated !"
    //         });
    //     }

    //    };
   });
});
}