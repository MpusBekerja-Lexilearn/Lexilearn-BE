import { Hono } from "hono";

const quizAnswer = new Hono()

quizAnswer.post("/", async (c) => {
    return c.json({ message: "Hello World" });
});

export default quizAnswer;