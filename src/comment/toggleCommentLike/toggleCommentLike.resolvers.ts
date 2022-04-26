// import pubsub, { NEW_NOTIFICATION } from "../../pubsub";
import { pushNotificationNotUploadPost } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const toggleCommentLikeFn:Resolver = async(_,{id},{client,loggedInUser}) => {
  // 코멘트 있는지.
  const comment = await client.comment.findUnique({
    where:{id},
    select:{
      id:true,
    },
  });
  if(!comment) return {ok:false,error:"comment not found"}
  const likeWhere = {
    commentId_userId:{
      commentId:id,
      userId:loggedInUser.id
    }
  }
  const like = await client.commentLike.findUnique({
    where:likeWhere,
    select:{
      id:true,
    },
  });
  if(like) {
    await client.commentLike.delete({where:likeWhere})
  } else {
    const result = await client.commentLike.create({
      data:{
        userId:loggedInUser.id,
        commentId:id
        // user:{
        //   connect:{
        //     id:loggedInUser.id
        //   }
        // },
        // comment:{
        //   connect:{
        //     id
        //     // id:comment.id
        //   }
        // }
      },
      select:{
        comment:{
          select:{
            userId:true,
            postId:true,
          }
        }
      }
    });

    const loggedInUserId = loggedInUser.id;
    const subscribeUserId = result.comment.userId;
    const postId = result.comment.postId;
    const commentId = id;

    // 좋아요 완료 후 notification, subscription
    // 좋아요 한 사람이 본인이면 안보냄.
    if(loggedInUserId !== subscribeUserId) {
      await pushNotificationNotUploadPost(client, "MY_COMMENT_GET_LIKE", loggedInUserId, subscribeUserId, {postId, commentId});
    }
      // if(result) {     // 이렇게 안해도 될듯
  //   try {
  //     const notification = await client.notification.create({
  //       data:{
  //         which:"MY_COMMENT_GET_LIKE",
  //         publishUser:{
  //           connect:{
  //             id:loggedInUser.id
  //           }
  //         },
  //         subscribeUserId:result.comment.userId
  //       },
  //       //include 해야 유저 정보 pubsub 으로 보낼 수 있음.
  //       include:{
  //         publishUser:{
  //           select:{
  //             id:true,
  //             userName:true,
  //             avatar:true,
  //           }
  //         },
  //       }
  //     });
  //     // subscription 전송
  //     await pubsub.publish(NEW_NOTIFICATION,{userNotificationUpdate:{...notification}})
  //   } catch (e) {
  //     console.log(e);
  //     console.log("notification, subscription 에서 문제 발생")
  //   }
  }
  
  return {ok:true}
}

const resolver:Resolvers = {
  Mutation:{
    toggleCommentLike:protectResolver(toggleCommentLikeFn)
  }
}
export default resolver