import { gql } from "apollo-server-express";

export default gql`
  enum ErrorCode {
    USERNAME
    EMAIL
    UNKNOWN
  }
  type createAccountResponse {
    ok:Boolean!
    # error:ErrorCode
    errorCode:ErrorCode
  }
  type Mutation {
    createAccount(
      firstName: String!
      lastName: String
      userName: String!
      email: String!
      password: String!
    ):createAccountResponse!
  }
`;
