import * as dotenv from "dotenv";
dotenv.config();
export default {
  APP: process.env.APP || "development",
  PORT: process.env.PORT || "3004",

  DB_DIALECT: process.env.DB_DIALECT || "mongo",
  DB_HOST: "mongodb://localhost:27017/example_db",
  DB_NAME: process.env.DB_NAME || "example_db",
  DB_PASSWORD: process.env.DB_PASSWORD || "db-password",
  DB_PORT: process.env.DB_PORT || "27017",
  DB_USER: process.env.DB_USER || "root",

  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || "jwt_please_change",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1h",
  SALT_ROUNDS: process.env.SALT_ROUNDS || 10,

  AWSAccessKeyId: process.env.AWSAccessKeyId,
  AWSSecretKey: process.env.AWSSecretKey,
  googleClientId: "1063114410911-slnaa91kka6ltodhegaf1jlkli51jqto.apps.googleusercontent.com"
};
