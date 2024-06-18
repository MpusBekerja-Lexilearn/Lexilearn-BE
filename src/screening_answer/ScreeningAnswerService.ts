import { ScreeningAnswerListSchema } from "./ScreeningAnswerSchema";
import * as ScreeningAnswerRepository from "./ScreeningAnswerRepository";
import { InsertScreeningAnswer } from "@/schema";

export const createAnswer = async (claimId: string, payload: ScreeningAnswerListSchema) => {
    const answerYes = payload.answers.filter((answer) => answer.answer === 'yes').length
    const answerNo = payload.answers.filter((answer) => answer.answer === 'no').length
    const answerNotSure = payload.answers.filter((answer) => answer.answer === 'not_sure').length

    const totalQuestion = payload.answers.length
    const totalAnswerScore = (answerYes*2) + (answerNo*0) + (answerNotSure*1)
    
    const score = (totalAnswerScore / (totalQuestion * 2)) * 100

    const parentPayload: InsertScreeningAnswer = {
        userId: Number(claimId),
        score: score,
    }

    const screeningAnswerId = await ScreeningAnswerRepository.createAnswer(parentPayload, payload.answers)
    
    return {
        data: {
            answerId: screeningAnswerId,
            score: parentPayload.score,
        }
    }
}