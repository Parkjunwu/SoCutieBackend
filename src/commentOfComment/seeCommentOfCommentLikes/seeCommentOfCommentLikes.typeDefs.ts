import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seeCommentOfCommentLikes(commentOfCommentId:Int!,cursorId:Int):[User]
  }
`;