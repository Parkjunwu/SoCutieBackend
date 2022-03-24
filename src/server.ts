import "dotenv/config";
import morgan from "morgan";
import { createServer } from "http";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { resolvers, typeDefs } from "./schema";
import { ApolloServerPluginLandingPageGraphQLPlayground, ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageDisabled } from "apollo-server-core";
import { getUser } from "./user/user.utils";
import client from "./client";
import { graphqlUploadExpress } from "graphql-upload";
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';


// 얘네는 FCM notification 인데.. 일단 뺌
// const admin = require("firebase-admin");

// const serviceAccount = require("../basenotification-77020-firebase-adminsdk-ql1ua-e8c7541585.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   // databaseURL: "https://basenotification-77020.firebaseio.com",
// });



(async function () {
  const app = express();
  app.use(morgan("tiny"));
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  
  // 새로운 subscription 서버
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  // subscription 에서 토큰 받아서 context 설정하는 함수
  const getDynamicContext = async (ctx, msg, args) => {
  const token = ctx.connectionParams.token;
    if (token) {
      const loggedInUser = await getUser(token);
      return { loggedInUser };
    }
    // Otherwise let our resolvers know we don't have a current user
    return { loggedInUser: null };
  };

  // 얘가 subscription 에서 하는 애
  const serverCleanup = useServer(
    {
      schema,
      context: (ctx, msg, args) => {
        return getDynamicContext(ctx, msg, args);
      },
      // onConnect: () => {
      //   console.log("connect~~")
      // },
      // onDisconnect() {
      //   console.log('Disconnected!');
      // },
    },
    wsServer
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
    },
    plugins: [
      // Playground, 얘를 production 때 없애야 하나?
      process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
      // 뭔진 모르지만 subscription 신버전 필요한거
      ApolloServerPluginDrainHttpServer({ httpServer }),
      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}/graphql`)
  );
})();
