import { gql } from "apollo-server-express";

export default gql`
  type SeeFollowingResult {
    ok: Boolean!
    error: String
    following: [User]
    lastId: Int
  }
  type Query {
    seeFollowing(id:Int!, lastId: Int): SeeFollowingResult!
  }
`;
