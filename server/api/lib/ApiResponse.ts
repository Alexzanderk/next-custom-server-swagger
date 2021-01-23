import { ExegesisContext } from 'exegesis-express';

export function respondWithCode(context: ExegesisContext, code: number, message: any) {
    context.res.status(code).json(message);
}

export function respondError(context: ExegesisContext, message: any) {
    respondWithCode(context, 400, { message, code: 400 });
}

export const responseWithError = (context: ExegesisContext, e: any) => {
    const response = e.response || e;
    const status = response.status || 400;
    const message = response.data || e.message;
    respondWithCode(context, status, { message, code: status });
};
