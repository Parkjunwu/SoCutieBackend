import { gql } from "apollo-server-express";

export default gql`
  type Query{
    seeHashTag(
      name:String!
    ):HashTag
  }
`