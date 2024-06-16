import { Hono } from "hono";
import * as ScreeningQuestionService from "./ScreeningQuestionService"
import { jwtware } from "@/lib";

const screeningQuestions = new Hono()

screeningQuestions.get('', jwtware, async (c) => {
    const resp = await ScreeningQuestionService.getQuestions()

    return c.json({
        code: 200,
        message: "success getting questions",
        ...resp
    }, 200)
})

export default screeningQuestions