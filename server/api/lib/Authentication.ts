import { config } from 'dotenv';
import { AuthenticationResult, ExegesisPluginContext } from 'exegesis-express';

config();

export async function routeAuthentication(context: ExegesisPluginContext): Promise<AuthenticationResult> {
  try {
    const [bearer, token] = context.req.headers!.authorization!.split(' ');

    if (!bearer.startsWith('Bearer')) throw false;

    if (token == 'test') {
      return { type: 'success' }; // For testing purposes only, remove before PROD
    }

    return {
      type: 'invalid',
    };
  } catch (e) {
    return {
      type: 'invalid',
    };
  }
}
