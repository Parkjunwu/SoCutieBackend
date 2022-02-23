import { gql } from "apollo-server-express";

export default gql`
  type Query{
    subscribeProfile(id:Int!):User
  }
`;