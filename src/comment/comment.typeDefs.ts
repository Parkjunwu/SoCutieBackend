import { gql } from "apollo-server-express";

export default gql`
  type Comment {
    id:Int!
    user:User!
    post:Post!
    payload:String!
    createdAt:String!
    updatedAt:String!
    isMine:Boolean!
    totalLikes:Int!
  }
`