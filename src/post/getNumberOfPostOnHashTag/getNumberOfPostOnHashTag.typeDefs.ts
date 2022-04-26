import { gql } from "apollo-server-express";

export default gql`
# name 말고 id 로 받게... 일단 그렇게 함. 아직 안쓰니까 나중에 필요하면 고칠것.
  type Query {
    getNumberOfPostOnHashTag(name:String!):Int!
  }
`