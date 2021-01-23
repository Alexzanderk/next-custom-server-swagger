import express, { Express, Request, Response } from 'express';
import { parse, UrlWithParsedQuery } from 'url';
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';

const createClietApp = (
  nextHandler: (req: IncomingMessage, res: ServerResponse, parsedUrl?: UrlWithParsedQuery | undefined) => Promise<void>,
): Express => {
  const client = express();

  client.use('/_next', express.static(path.join(__dirname, '..', '..', '.next', 'static')));

  client.use((req: Request, res: Response) => {
    const parsedUrl = parse(req.url!, true);
    nextHandler(req, res, parsedUrl);
  });

  return client;
};

export { createClietApp };
