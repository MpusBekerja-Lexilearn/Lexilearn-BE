import { tryit } from "radash";
import { db } from "@/db";
import { InsertScreeningAnswer, InsertScreeningAnswerDetail, screeningAnswerDetail, screeningAnswers } from "@/schema";
import { HTTPException } from "hono/http-exception";
import { customLogger } from "@/utils/customLogger";

export const createAnswer = async(parentPayload: InsertScreeningAnswer, childPayload: InsertScreeningAnswerDetail[]) => {
    const insertedId = await db.transaction(async (tx) => {
        const [parentErr, result] = await tryit(async() => tx.insert(screeningAnswers).values(parentPayload).returning({ insertedId: screeningAnswers.id }))()
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
    
        const [childErr] = await tryit(async() => tx.insert(screeningAnswerDetail).values(childPayload))()
    
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