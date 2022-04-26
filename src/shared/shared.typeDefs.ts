import { gql } from "apollo-server-express";

export default gql`
  type MutationResponse {
    ok:Boolean!
    id:Int
    error:String
  }
  interface CursorPagination {
    cursorId:Int,
    hasNextPage:Boolean,
    error:String,
  }
`