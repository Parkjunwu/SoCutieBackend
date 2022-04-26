import { gql } from "apollo-server-express";

export default gql`
  # seePostLikes, seeCommentOfCommentLikes 에도 똑같이 씀
  type SeeLikesResponse implements CursorPagination {
    cursorId:Int
    hasNextPage:Boolean
    likeUsers:[User]
    error:String
    # 프론트엔드에서 subscription 데이터 받기 위함... 다른 방법이 안떠오름.
    isNotFetchMore:Boolean!
  }
  type Query {
    seeCommentLikes(commentId:Int!,cursorId:Int):SeeLikesResponse!
  }
`;