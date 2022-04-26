import { gql } from "apollo-server-express";

export default gql`
  type GetNotifiedCommentResponse {
    comment:Comment
    error:String
  }
  type Query {
    getNotifiedComment(
      commentId:Int!
      # 댓글이나 유저를 삭제했거나 해서 못받을 수 있음. 필수 아닌걸로
    ):GetNotifiedCommentResponse!
  }
`