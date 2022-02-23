import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    editCommentOfComment(
      id:Int!
      payload:String!
    ):MutationResponse!
  }
`