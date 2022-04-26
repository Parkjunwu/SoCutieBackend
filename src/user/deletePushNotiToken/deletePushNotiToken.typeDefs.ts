import { gql } from "apollo-server-express";

const resolver = gql`
  type Mutation {
    deletePushNotiToken: MutationResponse!
  }
`;
export default resolver;