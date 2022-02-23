import { gql } from "apollo-server-express";

export default gql`
  type Mutation {
    deletePost(
      id:Int!  
    ):MutationResponse!
  }
`