import bodyParser from "body-parser";
import cors from "cors";
import express from "express";

import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import apiV1 from "./apiV1/index";
import * as errorHandler from "./helpers/errorHandler";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.initializeSwagger();
    this.setRoutes();
    this.catchErrors();
  }

  private setMiddlewares(): void {
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(helmet());
    this.express.use(cookieParser());
  }

  private setRoutes(): void {
    this.express.use("/v1", apiV1);
  }

  private catchErrors(): void {
    this.express.use(errorHandler.notFound);
    this.express.use(errorHandler.unAuthorized);
    this.express.use(errorHandler.internalServerError);
  }

  private initializeSwagger() {
    const swaggerJSDoc = require('swagger-jsdoc');
    const swaggerUi = require('swagger-ui-express');

    const options = {
      swaggerDefinition: {
        info: {
          title: 'REST API',
          version: '1.0.0',
          description: 'Example docs',
        },
      },
      apis: ['swagger.yaml'],
    };

    const specs = swaggerJSDoc(options);
    this.express.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
    this.express.get('/swagger-doc', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(specs);
    });
  }
}

export default new App().express;
