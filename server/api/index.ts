//Import librarys used
import path from 'path';
import express, { Application, NextFunction, Response, Request } from 'express';
import * as exegesis from 'exegesis-express';
import { routeAuthentication as bearerAuthentication } from './lib/Authentication';

const API_DOC_PATH = path.resolve(__dirname, '..', '..', 'api', 'openapi.yaml');

const exegesisSwaggerUIPlugin = require('exegesis-plugin-swagger-ui-express');

const createApiApp = async (): Promise<Application> => {
  const api = express();

  api.on('mount', () => console.log('> 🎉 API mounted'));

  // See https://github.com/exegesis-js/exegesis/blob/master/docs/Options.md
  const options: exegesis.ExegesisOptions = {
    controllers: path.resolve(__dirname, './controllers'),
    controllersPattern: '**/*.@(ts|js)',
    ignoreServers: true,
    allowMissingControllers: false,
    authenticators: {
      bearer: bearerAuthentication,
    },
    allErrors: true,
    plugins: [
      exegesisSwaggerUIPlugin({
        app: api,
        path: '/docs',
        swaggerUIOptions: {
          explorer: true,
        },
      }),
      //loggerPlugin
    ],
  };

  // This creates an exegesis middleware, which can be used with express,
  // connect, or even just by itself.
  const exegesisMiddleware = await exegesis.middleware(API_DOC_PATH, options);

  // If you have any body parsers, this should go before them.
  api.use(exegesisMiddleware);

  // Return a 404
  api.use((_req, res) => {
    res.status(404).json({ message: `Not found` });
  });

  // Handle any unexpected errors
  api.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(500).json({ message: `Internal error: ${err.message}` });
  });

  return api;
};

export { createApiApp };
