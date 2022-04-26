import { gql } from "apollo-server-express";

export default gql`
  type GetUserPostsResponse {
    cursorId:Int
    hasNextPage:Boolean
    posts:[Post]
    error:String
  }
  type Query {
    getUserPosts(userId:Int!,cursorId:Int):GetUserPostsResponse!
  }
`;