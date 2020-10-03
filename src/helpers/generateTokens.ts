import * as jwt from "jsonwebtoken";
import config from "../config/config";

export async function generateTokens(email: string) {
  console.log(config.JWT_EXPIRATION);
  const [accessToken, refreshToken] = await Promise.all([jwt.sign({email}, config.JWT_ENCRYPTION, {
    expiresIn: '10m'
  }), jwt.sign({email}, config.JWT_ENCRYPTION, {
    expiresIn: '30d'
  })]);
  return {accessToken, refreshToken}
}
