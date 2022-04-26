// import pubsub, { NEW_NOTIFICATION } from "../../pubsub";
import { pushNotificationNotUploadPost } from "../../pushNotificationAndPublish";
import { Resolver, Resolvers } from "../../types";
import { protectResolver } from "../../user/user.utils";

const toggleCommentOfCommentLikeFn:Resolver = async(_,{id},{client,loggedInUser}) => {
  // 코멘트 있는지.
  const commentOfComment = await client.commentOfComment.findUnique({
    where:{id},
    select:{
      id:true,
    },
  })
  if(!commentOfComment) return {ok:false,error:"commentOfComment not found"}
  const likeWhere = {
    commentOfCommentId_userId:{
      commentOfCommentId:id,
      userId:loggedInUser.id
    }
  }
  const like = await client.commentOfCommentLike.findUnique({
    where:likeWhere,
    select:{
      id:true,
    },
  })
  if(like) {
    await client.commentOfCommentLike.delete({where:likeWhere})
  } else {
    const result = await client.commentOfCommentLike.create({
      data:{
        userId:loggedInUser.id,
        commentOfCommentId:id
        // user:{
        //   connect:{
        //     id:loggedInUser.id
        //   }
        // },
        // commentOfComment:{
        //   connect:{
        //     id
        //     // id:commentOfComment.id
        //   }
        // }
      },
      select:{
        commentOfComment:{
          select:{
            userId:true,
            comment:{
              select:{
                postId:true,
              }
            },
            commentId:true,
          }
        }
      }
    });

    const loggedInUserId = loggedInUser.id;
    const subscribeUserId = result.commentOfComment.userId;
    const postId = result.commentOfComment.comment.postId;
    const commentId = result.commentOfComment.commentId;
    const commentOfCommentId = id;

    // 좋아요 완료 후 notification, subscription
    // 좋아요 한 사람이 본인이면 안보냄.
    if(loggedInUserId !== subscribeUserId) {
      await pushNotificationNotUploadPost(client, "MY_COMMENT_OF_COMMENT_GET_LIKE", loggedInUserId, subscribeUserId,{postId, commentId, commentOfCommentId});
    }
    // if(result) {     // 이렇게 안해도 될듯
    // try {
    //   const notification = await client.notification.create({
    //     data:{
    //       which:"MY_COMMENT_OF_COMMENT_GET_LIKE",
    //       publishUser:{
    //         connect:{
    //           id:loggedInUser.id
    //         }
    //       },
    //       subscribeUserId:result.commentOfComment.userId
    //     },
    //     //include 해야 유저 정보 pubsub 으로 보낼 수 있음.
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
    //   // subscription 전송
    //   await pubsub.publish(NEW_NOTIFICATION,{userNotificationUpdate:{...notification}})
    // } catch (e) {
    //   console.log(e);
    //   console.log("notification, subscription 에서 문제 발생")
    // }
  } 

  
  return {ok:true}
}

const resolver:Resolvers = {
  Mutation:{
    toggleCommentOfCommentLike:protectResolver(toggleCommentOfCommentLikeFn)
  }
}
export default resolver