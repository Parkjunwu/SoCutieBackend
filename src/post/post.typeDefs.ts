import { gql } from "apollo-server-express";

export default gql`
  type Post {
    id:Int!
    user:User!
    likes:Int!
    caption:String
    file:[String]
    # 굳이 comment 가 필요하면 like 제일 많은 하나 가져오기. 근데 그런건 없을듯?
    # comments:[Comment]
    createdAt: String!
    updatedAt: String!
    commentNumber:Int!
    isMine:Boolean!
    isLiked:Boolean!
  }

# HashTag 는 post 만 받는 걸로 구현함. 따로 타입 만들진 않음.
`