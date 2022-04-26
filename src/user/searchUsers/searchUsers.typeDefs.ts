import { gql } from "apollo-server-express";

export default gql`
  type SearchUsersResponse {
    cursorId:Int
    hasNextPage:Boolean
    users:[User]
    error:String
  }
  type Query {
    searchUsers(
      keyword:String!,
      cursorId:Int
    ):SearchUsersResponse!
  }
`;
