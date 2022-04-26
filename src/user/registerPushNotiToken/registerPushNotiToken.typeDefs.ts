import { gql } from "apollo-server-express";

const resolver = gql`
  type Mutation {
    registerPushNotiToken(
      deviceToken: String!
    ): MutationResponse!
  }
`;
export default resolver;
