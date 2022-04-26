import { gql } from "apollo-server-express";

export default gql`
  type SendMessageMutationResponse {
    ok:Boolean!
    error:String
    id:Int
    roomId:Int
    talkingTo:User
  }
  type Mutation {
    sendMessage(
      payload:String!
      roomId:Int
      userId:Int
    ):SendMessageMutationResponse!
  }
`