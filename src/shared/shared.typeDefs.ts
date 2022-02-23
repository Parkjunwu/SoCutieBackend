import { gql } from "apollo-server-express";

export default gql`
  type MutationResponse {
    ok:Boolean!
    id:Int
    error:String
  }
  # type IDMutationResponse implements MutationResponse {
  #   id:Int
  # }
`