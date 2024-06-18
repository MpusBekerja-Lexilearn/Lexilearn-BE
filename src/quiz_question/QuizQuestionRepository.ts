import { db } from "@/db"
import { quizQuestions, SelectQuizQuestion } from "@/schema"
import { sql } from "drizzle-orm"
import { HTTPException } from "hono/http-exception"
import { tryit } from "radash"

export const get = async () => {
    const [err, questions] = await tryit(async () => db.query.quizQuestions.findMany({
        orderBy: sql`RANDOM()`,
        limit: 5
    }))()

    if (err) {
        console.error(err);

        throw new HTTPException(500, {
            message: "failed to get questions"
        })
    }

    return questions
}