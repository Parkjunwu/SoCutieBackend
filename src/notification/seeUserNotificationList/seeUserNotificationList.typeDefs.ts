import { gql } from "apollo-server-express";

export default gql`
      # cursor 도 만들어야 할듯
  type Query {
    seeUserNotificationList(
      cursorId:Int
    ):[Notification]
  }
`;