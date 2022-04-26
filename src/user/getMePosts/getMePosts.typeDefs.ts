import { gql } from "apollo-server-express";

export default gql`
  type GetMePostsResponse {
    cursorId:Int
    hasNextPage:Boolean
    posts:[Post]
    error:String
  }
  type Query {
    getMePosts(cursorId:Int):GetMePostsResponse!
  }
`;