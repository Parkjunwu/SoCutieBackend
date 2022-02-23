import { gql } from "apollo-server-express";

export default gql`
  type CommentOfComment {
    id:Int!
    user:User!
    comment:Comment!
    payload:String!
    createdAt:String!
    updatedAt:String!
    isMine:Boolean!
    totalLikes:Int!
  }
`