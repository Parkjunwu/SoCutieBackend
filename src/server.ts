// require("dotenv").config();
// import { ApolloServer } from "apollo-server-express";
// import client from "./client";
// import { typeDefs, resolvers } from "./schema";
// import { getUser } from "./user/user.utils";
// import * as express from "express";
// import * as logger from "morgan";
// import * as http from "http"

// ////////////////////////////////////
// // apollo 2.25.2 버전임. 변경해서 써라 //
// ////////////////////////////////////

// const PORT = process.env.PORT;
// const apollo = new ApolloServer({
//   resolvers,
//   typeDefs,
//   /////////여기 밑에 두개 지워라/////
//   // playground:true,
//   // introspection:true,
//   ////////여기 위에 두개 지워라///////
//   context: async (context) => {
//     if(context.req){
//       return {
//         loggedInUser: await getUser(context.req.headers.token),
//         client,
//       };
//     } else {
//       const {connection:{context:{loggedInUser}}} = context
//       return {loggedInUser}
//     }
//   },
//   subscriptions:{
//     onConnect: async({token}:{token:String}) => {
//       if(!token) {
//         throw new Error("You can't listen.")
//       }
//       return {
//         loggedInUser: await getUser(token),
//         // client,
//       };
//     }
//     // onConnect: async({token}:{token?:String}) => {
//     //   console.log(token);
//     //   if(!token) {
//     //     throw new Error("You can't listen.")
//     //   }
//     //   return {
//     //     loggedInUser: await getUser(token),
//     //     // client,
//     //   };
//     // }
//   }
// });

// const app = express();
// app.use(logger("tiny"));
// app.use("/static", express.static("uploads"));
// apollo.applyMiddleware({ app });
// const httpServer = http.createServer(app);
// apollo.installSubscriptionHandlers(httpServer);
// httpServer.listen(PORT, () => {
//   console.log(`🚀Server is running on http://localhost:${PORT} ✅`);
// });




import "dotenv/config";
import morgan from "morgan";
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./schema";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { getUser } from "./user/user.utils";
import client from "./client";
import { graphqlUploadExpress } from "graphql-upload";

(async function () {
  const app = express();
  app.use(morgan("tiny"));
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe, 
      async onConnect(connectionParams:any) {
        if (connectionParams.token) {
          const loggedInUser = await getUser(connectionParams.token);
          return { loggedInUser };
        }
      }
    },
    { server: httpServer, path: '/graphql' },
    
  );

  const server = new ApolloServer({
    schema,
    context: async (context) => {
    if(context.req){
      return {
        loggedInUser: await getUser(context.req.headers.token + ""),
        client:client,
      };
    } 
    // 이게 뭐지
    // else {
    //   const {connection:{context:{loggedInUser}}} = context
    //   return {loggedInUser}
    // }
  },
    plugins: [
      // 얘를 production 때 없애야 하나?
      ApolloServerPluginLandingPageGraphQLPlayground,
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            }
          };
        }
      }
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();
