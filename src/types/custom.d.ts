import { JwtUserPayload } from './user.type.js';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: JwtUserPayload;
    }
  }
}
