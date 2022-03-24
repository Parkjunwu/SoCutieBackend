import { gql } from "apollo-server-express";

export default gql`
  type SeeFollowingResult {
    ok: Boolean!
    error: String
    following: [User]
    cursorId: Int
  }
  type Query {
    seeFollowing(id:Int!, cursorId: Int): SeeFollowingResult!
  }
`;
