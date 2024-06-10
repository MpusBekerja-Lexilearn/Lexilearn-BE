import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import AuthController from "./auth/AuthController"
import { customLogger } from './utils/customLogger';

const app = new Hono()

app.onError((err, c) => {
    console.error('Error:', err.message);
    if (err.cause && err.cause instanceof Error) {
        console.error('Cause:', err.cause.message);
    }

    if (err instanceof HTTPException) {
        let errMsg;

        if (
            (err.status === 400 || err.status === 500) &&
            err.cause instanceof Error
        ) {
            errMsg = err.message ? `${err.message}: ${err.cause.message}` : 'error';
        } else {
            errMsg = err.message || 'error';
        }

        return c.json({
            code: err.status,
            message: errMsg
        }, err.status);
    }

    return c.json({
        code : 500, 
        message: err.message || 'internal server error'
    }, 500);
})
app.use(prettyJSON())
app.use(logger(customLogger))

app.route('', AuthController)

export default app
