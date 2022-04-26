// import pubsub, { NEW_NOTIFICATION } from "../../pubsub";
import { pushNotificationNotUploadPost } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const createCommentFn:Resolver = async(_,{postId,payload},{client,loggedInUser}) => {
  if(!payload) return {ok:false,error:"Please write your comment"}
  const okAndPostOwnerId = await client.post.findUnique({
    where:{
      id:postId
    },
    select:{
      userId:true
    }
  });
  if(!okAndPostOwnerId) return {ok:false,error:"No photo on there"}
  const newComment = await client.comment.create({
    data:{
      payload,
      user:{
        connect:{
          id:loggedInUser.id
        }
      },
      post:{
        connect:{
          id:postId
        }
      }
    },
    select:{
      id:true,
      post:{
        select:{
          userId:true,
        }
      }
    }
  });

  const loggedInUserId = loggedInUser.id;
  const subscribeUserId = newComment.post.userId;
  const commentId = newComment.id;

  // 댓글 작성 후 notification, subscription
  // 댓글이 유저 본인꺼면 안보냄.
  if(loggedInUserId !== okAndPostOwnerId.userId) {
    await pushNotificationNotUploadPost(client, "MY_POST_GET_COMMENT", loggedInUserId, subscribeUserId, {postId, commentId});
  }
  // if(newComment){    얘는 굳이 안해도 될듯? 어차피 쟤가 안되면 오류뜨고 안되지 않나?
  // try {
  //   // notification 전송
  //   const notification = await client.notification.create({
  //     data:{
  //       which:"MY_POST_GET_COMMENT",
  //       publishUser:{
  //         connect:{
  //           id:loggedInUser.id
  //         }
  //       },
  //       subscribeUserId:newComment.post.userId
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

  return {ok:true,id:newComment.id}
}
const resolver:Resolvers = {
  Mutation:{
    createComment:protectResolver(createCommentFn)
  }
}

export default resolver