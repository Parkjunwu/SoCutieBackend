import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seeComments(postId:Int!,cursorId:Int):[Comment]
  }
`;