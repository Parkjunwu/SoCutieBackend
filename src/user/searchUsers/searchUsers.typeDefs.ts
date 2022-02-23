// import { gql } from "apollo-server";

// export default gql`
//   type Query {
//     searchUsers(keyword: String!): [User]
//   }
// `;

import { gql } from "apollo-server-express";

export default gql`
  type Result {
    users: [User]
    lastId: Int
  }
  type Query {
    searchUsers(keyword: String!, lastId: Int ): Result
  }
`;
