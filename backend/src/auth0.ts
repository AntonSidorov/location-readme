import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { environment } from './environment';

export const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${environment.auth0.domain}/.well-known/jwks.json`,
  }),
  algorithms: ['RS256'],
  requestProperty: 'user',
  credentialsRequired: false,
});

export interface JwtSchema {
  iss: string;
  sub: string; // This is what we will be using for ID in the DB
  aud: string;
  exp: number;
  iat: number;

  // Standard claims
  name: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname: string;
  email: string;
  email_verified: boolean;
}
