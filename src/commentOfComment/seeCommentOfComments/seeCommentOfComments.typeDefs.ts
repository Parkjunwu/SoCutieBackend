import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seeCommentOfComments(commentId:Int!,cursorId:Int):[CommentOfComment]
  }
`;