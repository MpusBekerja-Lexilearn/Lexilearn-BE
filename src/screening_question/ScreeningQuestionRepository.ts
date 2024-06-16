import { db } from "@/db"
import { HTTPException } from "hono/http-exception"
import { tryit } from "radash"

export const getQuestions = async () => {
    const [err, questions] = await tryit(async() => db.query.screeningQuestions.findMany())()

    if(err) {
        throw new HTTPException(500, {
            message: "failed to get questions"
        })
    }

    return questions
}