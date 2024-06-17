import { jwtware } from "@/lib";
import { Hono } from "hono";
import * as QuizQuestionService from "./QuizQuestionService";

const quizQuestion = new Hono()

quizQuestion.get('', jwtware, async (c) => {
    const resp = await QuizQuestionService.getQuiz()

    return c.json({
        code: 200,
        message: 'success get quiz',
        data: resp
    })
})

export default quizQuestion