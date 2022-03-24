import { Resolvers } from "../../types";
const bcrypt = require("bcrypt");

const resolverFn: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, userName, email, password },
      { client }
    ) => {
      try {
        // const checkUser = await client.user.findFirst({
        const checkUserName = await client.user.findUnique({
          where: {
            userName 
          },
          select:{
            id:true
          }
        });
        if (checkUserName) {
          return {
            ok: false,
            // error: "This username is already taken.",
            errorCode: "USERNAME",
          }
        }
        const checkEmail = await client.user.findUnique({
          where: {
            email,
          },
          select:{
            id:true
          }
        });
        if (checkEmail) {
          return {
            ok: false,
            // error: "This email is already taken.",
            errorCode: "EMAIL",
          }
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        await client.user.create({
          data: {
            firstName,
            lastName,
            userName,
            email,
            password: uglyPassword,
          },
          select:{
            id:true,
          }
        });
        return { ok: true };

      } catch (e) {
        return {
          ok: false,
          // error: "Cannot create account.",
          errorCode: "UNKNOWN",
        };
      }
    },
  },
};

export default resolverFn;
