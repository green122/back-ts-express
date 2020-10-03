import * as jsonwebtoken from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import * as Axios from 'axios';
import {Request, Response, NextFunction} from 'express'
import {promisify} from "util";
import config from "../../config/config";
import verifyToken from "../../helpers/verifyToken";
import httpStatus from "http-status";

export interface ClaimVerifyRequest {
  readonly token?: string;
}

export interface ClaimVerifyResult {
  readonly email: string;
  readonly clientId: string;
  readonly isValid: boolean;
  readonly error?: any;
}

interface TokenHeader {
  kid: string;
  alg: string;
}

interface PublicKey {
  alg: string;
  e: string;
  kid: string;
  kty: string;
  n: string;
  use: string;
}

interface PublicKeyMeta {
  instance: PublicKey;
  pem: string;
}

interface MapOfKidToPublicKey {
  [key: string]: PublicKeyMeta;
}

// import httpStatus from 'http-status';
// import config from '../../config/config';
//


export async function authenticate(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  const token = req.headers['x-access-token'] || req.cookies['x-access-token'];
  if (!token) {
    return next({status: httpStatus.UNAUTHORIZED, message: 'No token provided'})
  }
  try {
    const result = await verifyToken(token);
    (req.params as any).userInfo = result;
    return next();
  } catch (error) {
    next(error);
  }
}
