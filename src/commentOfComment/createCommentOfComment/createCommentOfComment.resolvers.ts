// import pubsub, { NEW_NOTIFICATION } from "../../pubsub";
import { pushNotificationNotUploadPost } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const createCommentOfCommentFn:Resolver = async(_,{commentId,payload},{client,loggedInUser}) => {
  if(!payload) return { ok:false,error:"Please write your comment" };
  const ok = await client.comment.findUnique({
    where:{
      id:commentId
    },
    select:{
      id:true
    }
  });
  if(!ok) return {ok:false,error:"No photo on there"}
  const newCommentOfComment = await client.commentOfComment.create({
    data:{
      payload,
      user:{
        connect:{
          id:loggedInUser.id
        }
      },
      comment:{
        connect:{
          id:commentId
        }
      }
    },
    select:{
      id:true,
      comment:{
        select:{
          userId:true
        }
      }
    }
  });

  // 댓글 작성 후 notification, subscription
  await pushNotificationNotUploadPost(client, "MY_COMMENT_GET_COMMENT", loggedInUser.id, newCommentOfComment.comment.userId);
  // if(result){    얘는 굳이 안해도 될듯? 어차피 쟤가 안되면 오류뜨고 안되지 않나?
  // try {
  //   // notification 전송
  //   const notification = await client.notification.create({
  //     data:{
  //       which:"MY_COMMENT_GET_COMMENT",
  //       publishUser:{
  //         connect:{
  //           id:loggedInUser.id
  //         }
  //       },
  //       subscribeUserId:newCommentOfComment.comment.userId
  //     },
  //       //include 해야 유저 정보 pubsub 으로 보낼 수 있음.
  //     include:{
  //       publishUser:{
  //         select:{
  //           id:true,
  //           userName:true,
  //           avatar:true,
  //         }
  //       },
  //     }
  //   });
  //     // subscription 전송
  //   await pubsub.publish(NEW_NOTIFICATION,{userNotificationUpdate:{...notification}})
  // } catch (e) {
  //   console.log(e);
  //   console.log("notification, subscription 에서 문제 발생")
  // }
  
  return {ok:true,id:newCommentOfComment.id}
}
const resolver:Resolvers = {
  Mutation:{
    createCommentOfComment:protectResolver(createCommentOfCommentFn)
  }
}

export default resolver