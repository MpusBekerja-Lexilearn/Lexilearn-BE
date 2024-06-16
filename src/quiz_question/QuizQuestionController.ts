import { Hono } from "hono";

const quizQuestion = new Hono()

quizQuestion.get('/', async (c) => {
    return c.json({
        message: 'Hello World'
    })
})

export default quizQuestion