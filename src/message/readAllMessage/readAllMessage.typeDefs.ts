import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    readAllMessage(roomId:Int!):MutationResponse!
  }
`