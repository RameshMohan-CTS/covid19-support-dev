import * as _ from "lodash";
import firebase from "firebase";

const db = firebase.firestore();

export const messages_get_recent_messages = (msg_read_status) =>{
    return new Promise((resolve,reject)=>{
        db.collection("messages")
        .orderBy("timestamp","desc")
        .where("msg_read","==", msg_read_status ? true:false)
        .limit(20)
        .get()
        .then(querySnapshot => {
            let mymessages = [];
            querySnapshot.forEach(doc => {
                mymessages.push({
                    id: doc.id,
                    data: doc.data()
                });
            });
            mymessages = mymessages.map(msg=> {
                msg.data.notes = msg.data.notes || [];
                return msg;
            })
            resolve(mymessages)
        }).catch(ex=>{
            console.log(ex);
            reject({
                msg: "Failed to retreive messages",
                ex
            })
        })
    })
}
export const messages_delete_msg_by_id = (msgid) =>{
    return new Promise((resolve,reject)=>{
        db.collection("messages")
        .doc(msgid)
        .delete()
        .then((res) => {
            resolve({
                msg : "Deleted",
                res
            })
        }).catch(ex=>{
            reject({
                msg: "Failed to delete messages",
                ex
            })
        })
    })
}
export const messages_update_msg_status = (msgid, msg_read) => {
    return new Promise((resolve,reject)=>{
        db.collection("messages").doc(msgid).set({
            msg_read
        },{ merge : true}).then((res)=>{
            resolve({
                msg : "message status updated"
            })
        }).catch(ex=>{
            reject({
                msg: "failed to udpate message status"
            })
        })
    })
}
export const messages_add_notes = (msgid, notes) => {
    return new Promise((resolve,reject)=>{
        db.collection("messages").doc(msgid)
        .set({ notes },{ merge: true})
        .then((res)=>{ resolve(res)})
        .catch(ex=> reject({ex}) )
    })
}