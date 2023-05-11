import firebase from "firebase";
import "firebase/firestore";
import { ROUTES } from "../route/constant";

firebase.initializeApp({
  // apiKey: "AIzaSyDD_BePP3MDAQ2t9TJ0cXhxobTtpabofxI",
  // authDomain: "qriteeq-10e39.firebaseapp.com",
  // databaseURL: "https://qriteeq-10e39.firebaseapp.com",
  // projectId: "qriteeq-10e39",
  // storageBucket: "qriteeq-10e39.appspot.com",
  // messagingSenderId: "738407288219",
  // appId: "1:738407288219:web:66bdfe4caaea416053e53e",
  // measurementId: "G-66NEVMWPZR",

  apiKey: "AIzaSyBMcXYCFZgA1oESMvODhKtD4h_M3OrTGH8",
  authDomain: "qriteeq-ec8fe.firebaseapp.com",
  databaseURL: "https://qriteeq-ec8fe.firebaseapp.com",
  projectId: "qriteeq-ec8fe",
  storageBucket: "qriteeq-ec8fe.appspot.com",
  messagingSenderId: "335452395933",
  appId: "1:335452395933:web:cd710527a1e451a7153774",
  measurementId: "G-HQWMNF3EXZ",
});
let db = firebase.firestore();

export default {
  firebase,
  db,
};
export const createconversation = async (
  moderator,
  reciever,
  message,
  sendarAvatar,
  username,
  navigate,
  fileExt,
  fileName,
  filePath,
  text,
  recieverusername,
  recieverAvatar
) => {
  db.collection("conversations")
    .where("uniquekey", "==", moderator + reciever)
    .get()
    .then(async (querySnapshot) => {
      if (querySnapshot.size !== 0) {
        querySnapshot.forEach((i) => {
          if (message?.trim() !== "") {
            sendMessage(
              i?.data()?.conversationId,
              message ? message : "",
              moderator,
              reciever,
              "OLD",
              sendarAvatar,
              fileExt,
              fileName,
              filePath,
              text
            );
            db.collection("conversations")
              .doc(i?.data()?.conversationId)
              .update({
                lastmessage: message ? message : "",
              });
          }

          if (navigate) {
            navigate(ROUTES.FEEDBACK + `?id=${i?.data()?.conversationId}`);
          }
        });
      } else {
        const conversation = await db.collection("conversations").add({
          // created: firebase.firestore.FieldValue.serverTimestamp(),
          created: new Date(),
          sender: moderator,
          reciever: reciever,
          uniquekey: moderator + reciever,
          sendarAvatar: sendarAvatar,
          senderusername: username ? `${username}` : "USER",
          recieverusername: recieverusername,
          recieverAvatar: recieverAvatar,
          // "https://qriteeq-dev.s3.ap-south-1.amazonaws.com/1657607190975QriteeqAvatar3.jpeg",
        });
        db.collection("conversations")
          .doc(conversation.id)
          .update({
            conversationId: conversation.id,
            lastmessage: message ? message : "",
          });
        if (navigate) {
          navigate(ROUTES.FEEDBACK + `?id=${conversation.id}`);
        }
        // sendMessage(
        //   conversation.id,
        //   message,
        //   moderator,
        //   reciever,
        //   "FRESH",
        //   sendarAvatar
        // );
      }
    });
};

export const sendMessage = async (
  conid,
  message,
  sender,
  reciever,
  type,
  sendarAvatar,
  fileExt,
  fileName,
  filePath,
  text
) => {
  if (type === "FRESH") {
    console.log(sender, "66666666666666");
    const mess = await db.collection("messagesMediaSending").add({
      conid: conid,
      created: new Date(),
      lastmessage: message,
      update: new Date(),
      message: firebase.firestore.FieldValue.arrayUnion({
        fileExt: "",
        fileName: "",
        filePath: "",
        sendarAvatar: sendarAvatar,
        sender: sender,
        text: true,
        reciever: reciever,
        message: message,
        created: new Date(),
      }),
    });
    db.collection("messagesMediaSending").doc(mess.id).update({
      messageId: mess.id,
    });
  } else {
    db.collection("messagesMediaSending")
      .where("conid", "==", conid)
      .get()
      .then(async (querySnapshot) => {
        if (querySnapshot?.size === 0) {
          const mess = await db.collection("messagesMediaSending").add({
            conid: conid,
            created: new Date(),
            lastmessage: message,
            update: new Date(),
            message: firebase.firestore.FieldValue.arrayUnion({
              fileExt: "",
              fileName: "",
              filePath: "",
              sendarAvatar: sendarAvatar,
              sender: sender,
              text: true,
              reciever: reciever,
              message: message,
              created: new Date(),
            }),
          });
          db.collection("messagesMediaSending").doc(mess.id).update({
            messageId: mess.id,
          });
        } else {
          querySnapshot.forEach((i) => {
            db.collection("messagesMediaSending")
              .doc(i?.data().messageId)
              .update({
                update: new Date(),
                lastmessage: message,
                message: firebase.firestore.FieldValue.arrayUnion({
                  fileExt: "",
                  fileName: "",
                  filePath: "",
                  sendarAvatar: sendarAvatar,
                  sender: sender,
                  text: true,
                  reciever: reciever,
                  message: message,
                  created: new Date(),
                }),
              });
          });
        }
      });
  }
};
export const getconversations = (sender) => {
  return db
    .collection("conversations")
    .where("sender", "==", sender)
    .get()
    .then(async (querySnapshot) => {
      let conversations = [];
      querySnapshot.forEach((i) => {
        conversations.push(i?.data());
      });
      return conversations;
    });
};

export const setMarkClaimed = (Id) => {
  return db
    .collection("reward")
   .doc(Id)
   .update({"RewardClaimed":true});
};

export const getMessages = (conid) => {
  return db
    .collection("messagesMediaSending")
    .where("conid", "==", conid)
    .get()
    .then(async (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((i) => {
        messages.push(i?.data());
      });
      return messages;
    });
};

export const createPoll = async (
  Quetion,
  OptionA,
  OptionB,
  OptionC,
  OptionD
) => {
  db.collection("demo").add({
    Question: Quetion,
    OptionA: OptionA,
    OptionB: OptionB,
    OptionC: OptionC,
    OptionD: OptionD,
  });
};
export const createreward = async (
  Amount,
  RewardId,
  Index,
  RewardValue,
  isActive,
  TimeStamp
) => {
  db.collection("rewarddetails").doc(RewardId).set({
    Amount: Amount,
    RewardId: RewardId,
    Index: Index,
    RewardValue: RewardValue,
    isActive: isActive,
    TimeStamp: firebase.firestore.Timestamp.fromDate(new Date()),
  });
 
};
export const getrewarddetails = (Id) => {
  return db
    .collection("reward")
     .doc(Id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data();
          // console.log("Document data:", doc.data());
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
};