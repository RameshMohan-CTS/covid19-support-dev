import * as _ from "lodash";
import firebase from "firebase";

const db = firebase.firestore();

export const updategroupaggrate  = (groups, user_email) => {
    return new Promise((resolve,reject)=>{
        db.collection("aggregated_data")
        .doc("groups")
        .set(groups,{merge:true})
        .then((res)=>{
            resolve({
                msg: "Settings saved Successfully",
                res
            });
        }).catch((ex)=>{
            console.log("Failed to save settings");
            reject({
                msg: "Failed to save settings",
                ex
            })
        })
    })
};


export const  getgroupaggrate  = () => {
    let data = [];
    return new Promise((resolve,reject)=>{
    db.collection('aggregated_data').doc("groups").get()
        .then(doc => {
            if (!doc.exists) {
                console.log('No such document!');
            } else {
                data =  doc.data();
               resolve({ data });
            }
        })
        .catch(err => {
            console.log(err);
            reject({
                msg: "Failed to retreive messages",
                err
            })
        });

    })
};


export const  creategroup  = (group, user_email) => {
    return new Promise((resolve,reject)=>{
         let groups = [];
         
         getgroupaggrate({})
         .then((res) => {
            res.data.groups.forEach(doc => {
                groups.push({ 
                    groupid : doc.groupid,
                    groupname : doc.groupname
                });
             });        
        });
        groups.push(group);
        setTimeout(() => {
            updategroupaggrate({ groups, user_email })
            .then((res)=>{
                resolve(res);
            })
            .catch((err)=>{ 
                reject(err);
            })   
            }, 1 * 1000); 


    })
};