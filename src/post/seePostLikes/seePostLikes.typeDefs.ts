import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seePostLikes(
      id:Int!,
      cursorId: Int
    ):[User]
  }
`