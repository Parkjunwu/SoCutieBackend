import { Resolver, Resolvers } from "../../types";

const getNotifiedCommentOfCommentFn:Resolver = async(_,{commentOfCommentId},{client,}) => {
  const commentOfComment = await client.commentOfComment.findUnique({
    where:{
      id:commentOfCommentId
    },
    include:{
      user:{
        select:{
          id:true,
          userName:true,
          avatar:true,
        }
      }
    }
  });

  if(!commentOfComment) {
    return { error: "해당 댓글이 존재하지 않습니다." };
  } else {
    return { commentOfComment };
  }
}
const resolver:Resolvers = {
  Query: {
    getNotifiedCommentOfComment:getNotifiedCommentOfCommentFn
  }
}

export default resolver