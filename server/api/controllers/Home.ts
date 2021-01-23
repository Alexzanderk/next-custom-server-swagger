import { ExegesisContext } from 'exegesis-express';
import path from 'path';
import { config } from 'dotenv';
config();

const PACKAGE_PATH = path.resolve(__dirname, '..', '..', '..', 'package.json');

const pkg = require(PACKAGE_PATH); //because ts complains otherwise

export async function index(_context: ExegesisContext) {
  return { app: pkg.name, version: pkg.version, docs: '/docs/' };
}

export function healthCheck(): void {
  return;
}
