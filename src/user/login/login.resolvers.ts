const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Mutation: {
    login: async (_, { userName, password }, { client }) => {
      const user = await client.user.findUnique({
        where: {
          userName
        },
        select: {
          id: true,
          password: true
        }
      });
      if (!user) {
        return { ok: false, error: "There is no user" };
      }
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return { ok: false, error: "incorrect Password" };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return { ok: true, token };
    },
  },
};
export default resolver;
