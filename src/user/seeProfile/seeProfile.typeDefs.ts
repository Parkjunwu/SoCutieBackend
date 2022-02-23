import { gql } from "apollo-server";

// 얜 어디서 쓰이는거지??

export default gql`
  type Query {
    seeProfile(id:Int!): User
  }
`;
