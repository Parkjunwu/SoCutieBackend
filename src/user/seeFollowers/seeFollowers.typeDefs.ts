import { gql } from "apollo-server-express";

export default gql`
  type SeeFollowersResult {
    ok: Boolean!
    error: String
    followers: [User]
    cursorId: Int
  }
  type Query {
    seeFollowers(id:Int!, cursorId: Int): SeeFollowersResult!
  }
`;
