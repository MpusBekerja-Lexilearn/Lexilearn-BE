import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import AuthController from "./auth/AuthController"
import { customLogger } from './utils/customLogger';
import screeningQuestionController from './screening_question/ScreeningQuestionController';
import screeningAnswerController from './screening_answer/SreeningAnswerController';
import quizQuestionController from './quiz_question/QuizQuestionController';
import quizAnswerController from './quiz_answer/QuizAnswerController';

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
            message: errMsg,
            errors: errMsg === 'validation error' ? err.cause : undefined
        }, err.status);
    }

    return c.json({
        code: 500,
        message: err.message || 'internal server error'
    }, 500);
})
app.use(prettyJSON())
app.use(logger(customLogger))

app.route('', AuthController)
app.route('screening/questions', screeningQuestionController)
app.route('screening/answers', screeningAnswerController)
app.route('quiz/questions', quizQuestionController)
app.route('quiz/answers', quizAnswerController)

export default {
    port: process.env.PORT || 3000,
    fetch: app.fetch
}
