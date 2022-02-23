import { gql } from "apollo-server-express";

const resolver = gql`
  type Mutation {
    followUser(
      # userName: String!
      id: Int!
    ): MutationResponse!
  }
`;
export default resolver;
