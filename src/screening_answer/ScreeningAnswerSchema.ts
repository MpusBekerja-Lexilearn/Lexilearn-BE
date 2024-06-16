import { enum_, InferInput, number, object, array } from "valibot";

enum ScreeningAnswerEnum {
    YES = 'yes',
    NO = 'no',
    NOT_SURE = 'not_sure'
}

export const screeningAnswerSchema = object({
    questionId: number(),
    answer: enum_(ScreeningAnswerEnum)
})

export type ScreeningAnswerSchema = InferInput<typeof screeningAnswerSchema>;

export const screeningAnswerListSchema = object({
    answers: array(screeningAnswerSchema)
})

export type ScreeningAnswerListSchema = InferInput<typeof screeningAnswerListSchema>;