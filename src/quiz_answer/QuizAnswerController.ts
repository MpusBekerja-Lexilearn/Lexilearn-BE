import { jwtware, validate } from "@/lib";
import { JWTPayload } from "@/types";
import { Hono } from "hono";
import { quizAnswerListSchema } from "./QuizAnswerSchema";
import * as QuizAnswerService from "./QuizAnswerService";

const quizAnswer = new Hono()

quizAnswer.post("/", jwtware, validate('json', quizAnswerListSchema), async (c) => {
    const payload = c.req.valid('json')
    const claims = c.get('jwtPayload') as JWTPayload

    const resp = await QuizAnswerService.createAnswer(claims.sub, payload)

    return c.json({
        code: 200,
        message: "Success create answer",
        data: resp
    });
});

export default quizAnswer;