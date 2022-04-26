import { gql } from "apollo-server-express";

export default gql`
  type readUpdateResponse {
    roomId:Int!
    userId:Int!
  }
  type Subscription{
    readUpdate(id:Int!):readUpdateResponse
  }
`