import { gql } from "apollo-server-express";

export default gql`
  type SearchPostsResponse {
    cursorId:Int
    hasNextPage:Boolean
    posts:[Post]
    error:String
  }
  type Query {
    searchPosts(
      keyword:String!,
      cursorId:Int
    ):SearchPostsResponse!
  }
`