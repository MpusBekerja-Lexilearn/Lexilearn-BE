import { jwtware, validate } from "@/lib";
import { Hono } from "hono";
import { screeningAnswerListSchema } from "./ScreeningAnswerSchema";
import * as ScreeningAnswerService from "./ScreeningAnswerService";
import { JWTPayload } from "@/types";

const screeningAnswer = new Hono()

screeningAnswer.post('', jwtware, validate('json', screeningAnswerListSchema), async (c) => {
    const payload = c.req.valid('json')
    const claims = c.get('jwtPayload') as JWTPayload

    const resp = await ScreeningAnswerService.createAnswer(claims.sub, payload)
    
    return c.json({
        code: 200,
        message: "success post screening answer",
        ...resp
    }, 200)
})

export default screeningAnswer