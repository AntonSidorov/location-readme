import { Db } from 'mongodb';
import { environment } from './environment';
import * as express from 'express';
import { JwtSchema } from './auth0';
import { DbSingleton } from './db';

interface ExpressContext {
  req: express.Request & { user?: JwtSchema };
  res: express.Response;
}

interface WebSocketContext {
  connection: any;
  payload: any;
}

type Context = ExpressContext | WebSocketContext;

// Utilities to determine if the request context is coming from websockets or HTTP (express)
// Simple way to check - express context must have the req property
// WebSocket request _seems_ to have a connection property
const isExpressRequest = (ctx: Context): ctx is ExpressContext =>
  (ctx as any).connection === undefined && (ctx as any).req !== undefined;
const isWebSocketRequest = (ctx: Context): ctx is ExpressContext =>
  (ctx as any).connection !== undefined && (ctx as any).req === undefined;

export interface ApolloContext {
  db: Db;
  userId?: string;
  userJwt?: JwtSchema;
}

const DEV_HEADER = 'lr_dev_uid';

export const makeContext = async (ctx: Context): Promise<ApolloContext> => {
  const db = await DbSingleton.instance();
  if (isExpressRequest(ctx)) {
    const { req } = ctx;
    let _userId: string | undefined;

    // Parse the userId this way only if not in production
    if (!environment.production && req.headers[DEV_HEADER] !== undefined) {
      _userId = req.headers[DEV_HEADER].toString();
    }

    return {
      db,
      userId: _userId || req.user?.sub,
      userJwt: req.user,
    };
  }
  if (isWebSocketRequest(ctx)) {
    return { db };
  }
  console.error('Received unknown context object. Request might fail', ctx);
};
