import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import helmet from "helmet";
import morgan from "morgan";
import apiV1 from "./apiV1/index";
import * as errorHandler from "./helpers/errorHandler";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.setRoutes();
    this.catchErrors();
  }

  private setMiddlewares(): void {
    this.express.use(cors());
    this.express.use(morgan("dev"));
    // this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(helmet());
  }

  private setRoutes(): void {
    this.express.use("/v1", apiV1);
  }

  private catchErrors(): void {
    this.express.use(errorHandler.notFound);
    this.express.use(errorHandler.internalServerError);
  }
}

export default new App().express;
