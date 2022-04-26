const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
import { Resolvers } from "../../types";

const resolver: Resolvers = {
  Mutation: {
    login: async (_, { userName, password }, { client }) => {
      const errorMessage = "아이디 / 비밀번호를 확인해 주세요.";
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
        return { ok: false, error: errorMessage };
      }
      const passwordOk = await bcrypt.compare(password, user.password);
      if (!passwordOk) {
        return { ok: false, error: errorMessage };
      }
      const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
      return { ok: true, token };
    },
  },
};
export default resolver;
