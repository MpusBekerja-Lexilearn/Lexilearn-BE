import { db } from "@/db"
import { InsertQuizAnswer, InsertQuizAnswerDetail, quizAnswerDetail, quizAnswers } from "@/schema"
import { customLogger } from "@/utils/customLogger"
import { HTTPException } from "hono/http-exception"
import { tryit } from "radash"

export const createAnswer = async(parentPayload: InsertQuizAnswer, childPayload: InsertQuizAnswerDetail[]) => {
    const insertedId = await db.transaction(async (tx) => {
        const [parentErr, result] = await tryit(async() => tx.insert(quizAnswers).values(parentPayload).returning({ insertedId: quizAnswers.id }))()
        const insertedId = result?.[0].insertedId
        
        if(parentErr) {
            customLogger("Create Answer Parent Error", parentErr.message)
            throw new HTTPException(500, {
                message: 'Failed to insert answers'
            })
        }
    
        childPayload.forEach((child) => {
            child.answerId = insertedId
        })
    
        const [childErr] = await tryit(async() => tx.insert(quizAnswerDetail).values(childPayload))()
    
        if(childErr) {
            customLogger("Create Answer Child Error", childErr.message)
            throw new HTTPException(500, {
                message: 'Failed to insert answers'
            })
        }

        return insertedId
    })

    return insertedId
}