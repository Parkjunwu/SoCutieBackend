import { gql } from "apollo-server-express";

export default gql`
  type TogglePostLikeResult {
    ok:Boolean!
    error:String
  }
  type Mutation {
    togglePostLike(
      id:Int!
    ):TogglePostLikeResult
  }
`