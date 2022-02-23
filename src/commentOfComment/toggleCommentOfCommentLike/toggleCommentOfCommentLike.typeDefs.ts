import { gql } from "apollo-server-express";

export default gql`
  type ToggleCommentOfCommentLikeResult {
    ok:Boolean!
    error:String
  }
  type Mutation {
    toggleCommentOfCommentLike(
      id:Int!
    ):ToggleCommentOfCommentLikeResult!
  }
`