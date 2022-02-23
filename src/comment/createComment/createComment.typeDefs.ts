import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    createComment(
      payload:String!
      postId:Int!
    ):MutationResponse!
  }
`