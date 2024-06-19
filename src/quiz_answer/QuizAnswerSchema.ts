import { array, InferInput, number, object, string } from "valibot";

export const quizAnswerSchema = object({
    questionId: number("your questionId must be a number"),
    answer: string("your password must be a string")
})

export type QuizAnswerSchema = InferInput<typeof quizAnswerSchema>;

export const quizAnswerListSchema = object({
    answers: array(quizAnswerSchema)
})

export type QuizAnswerListSchema = InferInput<typeof quizAnswerListSchema>;