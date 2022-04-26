import { gql } from "apollo-server";

export default gql`
  type SeeProfileResponse {
    user:User
    error:String
  }
  type Query {
    seeProfile(id:Int!): SeeProfileResponse!
  }
`;