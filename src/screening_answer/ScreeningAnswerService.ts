import { ScreeningAnswerListSchema } from "./ScreeningAnswerSchema";
import * as ScreeningAnswerRepository from "./ScreeningAnswerRepository";
import { InsertScreeningAnswer } from "@/schema";

export const createAnswer = async (claimId: string, payload: ScreeningAnswerListSchema) => {
    const parentPayload: InsertScreeningAnswer = {
        userId: Number(claimId),
        score: 80,
    }

    const screeningAnswerId = await ScreeningAnswerRepository.createAnswer(parentPayload, payload.answers)
    
    return {
        data: {
            answerId: screeningAnswerId,
            score: parentPayload.score,
        }
    }
}