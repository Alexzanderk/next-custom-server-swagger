import next from 'next';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import { config } from 'dotenv';

//You may choose HTTP or HTTPS, if HTTPS you need a SSL Cert
import * as http from 'http';
// import * as https from 'https';

import { createApiApp } from './api';
import { createClietApp } from './client';

import { morganMiddleware } from './middlewares/logger';

(async () => {
  config();

  const PORT = parseInt(process.env.PORT || '8000', 10);
  const dev = process.env.NODE_ENV?.toLowerCase() !== 'production';

  const nextApp = next({ dev });
  const handle = nextApp.getRequestHandler();

  const createServer = async () => {
    const app = express();
    const api = await createApiApp();
    const client = createClietApp(handle);

    app.disable('x-powered-by');

    app.get('/favicon.ico', (_req: Request, res: Response) => {
      res.status(204);
    });

    app.use(express.static(path.resolve(__dirname, '..', '.next')));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.use(morganMiddleware);

    app.use('/api', api);
    app.use(client);

    app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
      res.status(500).json({ error: err.message });
    });

    //Used to create a HTTP Server
    const server = http.createServer(app);

    /**
        * If you want to run a HTTPS server instead you must:
        * + Get a SSL Cert and Key to use
        * + Change the server type from http to https as shown below
        *
       const httpsOptions = {
           key: fs.readFileSync('./config/key.pem'),
           cert: fs.readFileSync('./config/cert.pem')
       }
       const server = https.createServer(httpsOptions,app);
       */
    return server;
  };

  await nextApp.prepare();
  const server = await createServer();
  server.listen(PORT);

  console.log(`
  > 📦 Server listening at http://localhost:${PORT} as ${dev ? 'development' : process.env.NODE_ENV}
  > 📦 Api doc at http://localhost:${PORT}/api/docs/ as ${dev ? 'development' : process.env.NODE_ENV}
  > 💻 Process PID: ${process.pid}
`);
})().catch((e) => {
  console.log(e);
  process.exit(1);
});
