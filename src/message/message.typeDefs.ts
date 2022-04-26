import { gql } from "apollo-server-express";

// 근데 어차피 둘이 얘기하는 거면 유저 정보를 받을 이유가 없네. isMine 만 만들어서 보내. sendMessage 에서 처음 보내는 상대일 때 조심해야겠네.

export default gql`
  type Message {
    id:Int!
    payload:String!
    user:User
    userId:Int
    room:Room!
    roomId:Int!
    read:Boolean!
    createdAt:String!
    updatedAt:String!
  }
  type Room {
    id:Int!
    talkingTo:User
    lastMessage:Message
    # users:[User]
    # messages:[Message]
    createdAt:String!
    updatedAt:String!
    unreadTotal:Int
    # avatar:String
    # lastMessage:Message
  }
`