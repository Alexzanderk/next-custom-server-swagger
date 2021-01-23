import morgan from 'morgan';
import chalk from 'chalk';

export const morganMiddleware = morgan(
    function (tokens, req, res) {
        return [
            chalk.hex('#ff4757').bold('🗒 -->'),
            chalk.hex('#34ace0').bold(tokens.method(req, res)),
            chalk.hex('#ffb142').bold(tokens.status(req, res)),
            chalk.hex('#ff5252').bold(tokens.url(req, res)),
            chalk.hex('#2ed573').bold(tokens['response-time'](req, res) + ' ms'),
            chalk.hex('#fffa65').bold('from ' + tokens.referrer(req, res)),
            chalk.hex('#1e90ff').bold('headers: ' + JSON.stringify(req.headers)),
            // chalk.hex('#1e90ff')(tokens['user-agent'](req, res)),
            '\n',
        ].join(' ');
    },
    {
        skip: function (req, _res) {
            return Boolean(req.url?.includes('/_next'));
        },
    }
);
