import { gql } from "apollo-server-express";

export default gql`
  type Query {
    searchPosts(
      keyword:String!,
      cursorId:Int
    ):[Post]
  }
`