import * as jwt from 'jsonwebtoken';
import config from '../config/config';
import {promisify} from "util";
import {ClaimVerifyResult} from "../apiV1/auth/auth.middleware";

interface Claim {
  token_use: string;
  auth_time: number;
  iss: string;
  exp: number;
  email: string;
  clientId: string;
}

const verifyPromised = promisify(jwt.verify.bind(jwt));

const verifyToken = async (token: string): Promise<ClaimVerifyResult> => {
  let result: ClaimVerifyResult;
  const tokenSections = (token || '').split('.');
  if (tokenSections.length < 2) {
    throw new Error('requested token is invalid');
  }
  const claim = await verifyPromised(token, config.JWT_ENCRYPTION) as Claim;
  const currentSeconds = Math.floor((new Date()).valueOf() / 1000);
  if (currentSeconds > claim.exp) {
    throw new Error('token is expired or invalid');
  }
  result = {email: claim.email, clientId: claim.clientId, isValid: true};
  return result;
};

export default verifyToken;
