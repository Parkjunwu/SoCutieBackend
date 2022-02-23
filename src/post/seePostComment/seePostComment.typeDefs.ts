import { gql } from "apollo-server-express";

export default gql`
  type Query {
    seePostComment(id:Int!):[Comment]
  }
`