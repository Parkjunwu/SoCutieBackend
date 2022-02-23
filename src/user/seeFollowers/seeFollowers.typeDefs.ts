import { gql } from "apollo-server-express";

export default gql`
  type SeeFollowersResult {
    ok: Boolean!
    error: String
    followers: [User]
    # totalPages: Int!
    lastId: Int
  }
  type Query {
    # seeFollowers(userName: String!, page: Int!): SeeFollowersResult!
    seeFollowers(id:Int!, lastId: Int): SeeFollowersResult!
  }
`;
