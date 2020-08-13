import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import http from 'http';
import express from 'express';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import { environment } from './environment';
import depthLimit = require('graphql-depth-limit');
import { makeContext } from './context';
import { checkJwt } from './auth0';
import { DbSingleton } from './db';

// Basic Node.JS setup
const app = express();
const server = http.createServer(app);

const apollo = new ApolloServer({
  schema: makeExecutableSchema({ typeDefs, resolvers }),
  playground: !environment.production,
  // Depth limit of 2 prevents recursive queries.
  // Recursiveness does not bring any value to the app in this case and can be harmful.
  validationRules: [depthLimit(3)],
  context: makeContext,
});

app.use(checkJwt);
console.log(environment.allowCors);
apollo.applyMiddleware({ app, cors: { origin: ['http://localhost:4200', environment.allowCors] } });
apollo.installSubscriptionHandlers(server);

server.listen(environment.port, () => {
  // When the server goes up - connect to the DB straight away
  DbSingleton.instance();
  console.log(`🚀 Server ready at http://localhost:${environment.port}${apollo.graphqlPath}`);
});
