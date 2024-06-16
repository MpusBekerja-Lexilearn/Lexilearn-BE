import { customLogger } from "@/utils/customLogger"
import * as ScreeningQuestionRepository from "./ScreeningQuestionRepository"

export const getQuestions = async () => {
    customLogger("Get questions", "Get questions")
    const questions = await ScreeningQuestionRepository.getQuestions()
    
    return {
        data: questions
    }
}