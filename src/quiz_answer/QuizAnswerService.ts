import { QuizAnswerListSchema } from "./QuizAnswerSchema";
import * as QuizAnswerRepository from "./QuizAnswerRepository";
import * as QuizQuestionRepository from "@/quiz_question/QuizQuestionRepository";
import { InsertQuizAnswer } from "@/schema";

export const createAnswer = async (claimId: string, payload: QuizAnswerListSchema) => {
    const questions = await QuizQuestionRepository.getManyById(payload.answers.map((answer) => answer.questionId));

    const score = payload.answers.reduce((acc, answer) => {
        const question = questions.find((question) => question.id === answer.questionId);

        if (!question) {
            return acc;
        }

        if (question.answerKey === answer.answer) {
            return acc + 1;
        }

        return acc;
    }, 0);

    const parentPayload: InsertQuizAnswer = {
        userId: Number(claimId),
        score: `${score}/${questions.length}`,
    };

    const childPayload = questions.map((question) => {
        const answer = payload.answers.find((answer) => answer.questionId === question.id);

        if (!answer) {
            return null;
        }

        return {
            questionId: question.id,
            answer: answer.answer,
        };
    })
    const filteredChildPayload = childPayload.filter(answer => answer !== null);

    const quizAnswerId = await QuizAnswerRepository.createAnswer(parentPayload, filteredChildPayload);

    return {
        answerId: quizAnswerId,
        score: parentPayload.score,
    }
} 