import { getMessaging } from "firebase-admin/messaging";
import { channel } from "./getChannel";

const deviceShownTitle = "So Cutie";

type priorityType = "high" | "default" | "min" | "low" | "max"

// 근데 이거 매개변수 너무 많아.
const singleSendConfigure = (channelId:string,token:string,message:string,obj:object) => {
  // 이래 안하면 경고 뜸.
  const priority: priorityType = "high";
  return {
    token,
    notification: {
      title: deviceShownTitle,
      body: message,
    },
    data: {
      // 여기 channelId 는 로직에서 구분하기 위함.
      channelId,
      ...obj
    },
    android: {
      notification: {
        // 얘의 channelId 랑 apns category 꼭 있어야 하나? 그래야 유저가 바꿀 수 있겠지?
        channelId,
        vibrateTimingsMillis: [0, 500],
        priority,
        defaultVibrateTimings: false,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          // 얘 있어야하나?
          category: channelId,
        },
      },
    },
  }
};

// single 일 때랑 진동이 다름 !!!
const manySendConfigure = (channelId:string,tokens:string[],message:string,obj?:object) => {
  // 이래 안하면 경고 뜸.
  const priority: priorityType = "high";
  return {
    tokens,
    notification: {
      title: deviceShownTitle,
      body: message,
    },
    data: {
      channelId,
      ...obj
    },
    android: {
      notification: {
        channelId,
        // single 일 때랑 진동이 다름 !!!
        vibrateTimingsMillis: [0, 500, 500, 500],
        priority,
        defaultVibrateTimings: false,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          category: channelId,
        },
      },
    },
  }
};

// 얘 말고 밑에 uploadPostPushNotification 쓰는게 나을듯. 걔네는 매개변수들도 같이 보냄
// 여러 기기에 보냄.
export const sendManyPushNotification = (channelId:string,tokens:string[],message:string) => {

  getMessaging().sendMulticast({
    tokens,
    notification: {
      title: deviceShownTitle,
      body: message,
      // message, data
    },
    data :{
      channelId,
    },
    android: {
      notification: {
        channelId,
        vibrateTimingsMillis: [0, 500, 500, 500],
        priority: "high",
        defaultVibrateTimings: false,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          category: channelId,
        },
      },
    },
  })
  // .then(console.log)
  .catch(res=>console.error("푸시 알림 보내기 에러" + res));
};

// 얘 말고 밑에 ~~~PushNotification 쓰는게 나을듯. 걔네는 매개변수들도 같이 보냄
// 한 기기기에만 보냄.
export const sendSinglePushNotification = (token:string,message:string,channelName:string,params?:object) => {
  
  getMessaging().send({
    token,
    notification: {
      title: deviceShownTitle,
      body: message,
    },
    data :{
      // 여기 channelId 는 로직에서 구분하기 위함.
      channelId: channelName,
      ...params
    },
    android: {
      notification: {
        // 얘의 channelId 랑 apns category 꼭 있어야 하나? 그래야 유저가 바꿀 수 있겠지?
        channelId: channelName,
        vibrateTimingsMillis: [0, 500],
        priority: "high",
        defaultVibrateTimings: false,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          // 얘 있어야하나?
          category: channelName,
        },
      },
    },
  })
  // .then(console.log)
  .catch(res=>console.error("푸시 알림 보내기 에러" + res));
};


// 팔로우 푸시알림. 얘는 다른 유저가 봐도 상관없는 프로필로 navigate 하니 디바이스 유저 체크 안함.
export const followUserPushNotification = (token:string,message:string,followerId:number,followerUserName:string) => {
  
  // 축약
  // getMessaging().send(singleSendConfigure(channel.follow,token,message,{
  //   followerId:String(followerId),followerUserName
  // }))
  //  .catch(res=>console.error("followUser 푸시 알림 보내기 에러" + res));

  getMessaging().send({
    token,
    notification: {
      title: deviceShownTitle,
      body: message,
    },
    data: {
      // 여기 channelId 는 로직에서 구분하기 위함.
      channelId: channel.follow,
      followerId:String(followerId),
      followerUserName
    },
    android: {
      notification: {
        // 얘의 channelId 랑 apns category 꼭 있어야 하나? 그래야 유저가 바꿀 수 있겠지?
        channelId: channel.follow,
        vibrateTimingsMillis: [0, 500],
        priority: "high",
        defaultVibrateTimings: false,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          // 얘 있어야하나?
          category: channel.follow,
        },
      },
    },
  })
  // .then(console.log)
  .catch(res=>console.error("followUser 푸시 알림 보내기 에러" + res));
};


// 업로드 푸시알림. 얘도 다른 유저가 봐도 상관없는 프로필로 navigate 하니 디바이스 유저 체크 안함.
export const uploadPostPushNotification = (tokens:string[],message:string,photoId: number) => {

  // 축약
  // getMessaging().sendMulticast(manySendConfigure(channel.upload,tokens,message,{
  //   photoId:String(photoId)
  // }));
  //  .catch(res=>console.error("uploadPost 푸시 알림 보내기 에러" + res));
  
  getMessaging().sendMulticast({
    tokens,
    notification: {
      title: deviceShownTitle,
      body: message,
    },
    data: {
      // 여기 channelId 는 로직에서 구분하기 위함.
      channelId: channel.upload,
      photoId:String(photoId),
    },
    android: {
      notification: {
        // 얘의 channelId 랑 apns category 꼭 있어야 하나? 그래야 유저가 바꿀 수 있겠지?
        channelId: channel.upload,
        vibrateTimingsMillis: [0, 500],
        priority: "high",
        defaultVibrateTimings: false,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          // 얘 있어야하나?
          category: channel.upload,
        },
      },
    },
  })
  // .then(console.log)
  .catch(res=>console.error("uploadPost 푸시 알림 보내기 에러" + res));
};

// 포스팅 좋아요 푸시알림. 얘도 다른 유저가 봐도 상관없는 프로필로 navigate 하니 디바이스 유저 체크 안함.
export const postLikePushNotification = (token:string,message:string,photoId: number) => {
  
  // 축약
  // getMessaging().send(singleSendConfigure(channel.postLike,token,message,{
  // photoId:String(photoId)
  // }))
    // .catch(res=>console.error("postLike 푸시 알림 보내기 에러" + res));

  getMessaging().send({
    token,
    notification: {
      title: deviceShownTitle,
      body: message,
    },
    data: {
      // 여기 channelId 는 로직에서 구분하기 위함.
      channelId: channel.postLike,
      photoId:String(photoId),
    },
    android: {
      notification: {
        // 얘의 channelId 랑 apns category 꼭 있어야 하나? 그래야 유저가 바꿀 수 있겠지?
        channelId: channel.postLike,
        vibrateTimingsMillis: [0, 500],
        priority: "high",
        defaultVibrateTimings: false,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          // 얘 있어야하나?
          category: channel.postLike,
        },
      },
    },
  })
  // .then(console.log)
  .catch(res=>console.error("postLike 푸시 알림 보내기 에러" + res));
};


// 포스팅 좋아요 푸시알림. 얘도 다른 유저가 봐도 상관없는 프로필로 navigate 하니 디바이스 유저 체크 안함.
export const postCommentPushNotification = (token:string,message:string,postId: number, commentId: number) => {
  
  // 축약
  getMessaging().send(singleSendConfigure(channel.postComment,token,message,{
    photoId:String(postId),
    commentId:String(commentId)
  }))
    .catch(res=>console.error("postComment 푸시 알림 보내기 에러" + res));
};

// 댓글 좋아요 푸시알림. 얘도 다른 유저가 봐도 상관없는 프로필로 navigate 하니 디바이스 유저 체크 안함.
export const commentLikePushNotification = (token:string,message:string,postId: number, commentId: number) => {
  
  // 축약
  getMessaging().send(singleSendConfigure(channel.commentLike,token,message,{
    photoId:String(postId),
    commentId:String(commentId)
  }))
    .catch(res=>console.error("commentLike 푸시 알림 보내기 에러" + res));
};

// 대댓글 푸시알림. 얘도 다른 유저가 봐도 상관없는 프로필로 navigate 하니 디바이스 유저 체크 안함.
export const commentCommentPushNotification = (token:string,message:string,postId: number, commentId: number, commentOfCommentId: number) => {
  
  // 축약
  getMessaging().send(singleSendConfigure(channel.commentComment,token,message,{
    photoId:String(postId),
    commentId:String(commentId),
    commentOfCommentId:String(commentOfCommentId)
  }))
    .catch(res=>console.error("commentComment 푸시 알림 보내기 에러" + res));
};

// 대댓글 좋아요 푸시알림. 얘도 다른 유저가 봐도 상관없는 프로필로 navigate 하니 디바이스 유저 체크 안함.
export const commentCommentLikePushNotification = (token:string,message:string,postId: number, commentId: number, commentOfCommentId: number) => {
  
  // 축약
  getMessaging().send(singleSendConfigure(channel.commentCommentLike,token,message,{
    photoId:String(postId),
    commentId:String(commentId),
    commentOfCommentId:String(commentOfCommentId)
  }))
    .catch(res=>console.error("commentCommentLike 푸시 알림 보내기 에러" + res));
};

// sendMessage 푸시알림. currentUserId 를 함께 보내서 만약 해당 디바이스에 로그인 안한 상태면 navigate 안하도록
export const sendMessagePushNotification = (token:string,message:string,roomId:number,sendersUserName:string,currentUserId:number) => {
  
  // 축약
  // getMessaging().send(singleSendConfigure(channel.message,token,message,{
  //   roomId:String(roomId),
  //   sendersUserName,
  //   loggedInUserId:String(currentUserId)
  // }))
  //   .catch(res=>console.error("sendMessage 푸시 알림 보내기 에러" + res));

  getMessaging().send({
    token,
    notification: {
      title: deviceShownTitle,
      body: message,
    },
    data :{
      // 여기 channelId 는 로직에서 구분하기 위함.
      channelId: channel.message,
      roomId:String(roomId),
      sendersUserName,
      currentUserId:String(currentUserId)
    },
    android: {
      notification: {
        channelId: channel.message,
        vibrateTimingsMillis: [0, 500],
        priority: "high",
        defaultVibrateTimings: false,
      },
    },
    apns: {
      payload: {
        aps: {
          sound: "default",
          category: channel.message,
        },
      },
    },
  })
  // .then(console.log)
  .catch(res=>console.error("sendMessage 푸시 알림 보내기 에러" + res));
};



// follow, upload, postLike, sendMessage 는 축약으로 안함.