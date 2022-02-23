import { gql } from "apollo-server-express";

export default gql`
  type Subscription{
    # userNotificationUpdate(userId:Int!):Notification
    userNotificationUpdate:Notification
  }
`