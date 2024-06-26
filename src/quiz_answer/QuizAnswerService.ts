import { QuizAnswerListSchema } from "./QuizAnswerSchema";
import * as QuizAnswerRepository from "./QuizAnswerRepository";
import * as QuizQuestionRepository from "@/quiz_question/QuizQuestionRepository";
import { InsertQuizAnswer, quizQuestionTypeEnum } from "@/schema";

export const createAnswer = async (claimId: string, payload: QuizAnswerListSchema) => {
    const questions = await QuizQuestionRepository.getManyById(payload.answers.map((answer) => answer.questionId));

    const score = payload.answers.reduce((acc, answer) => {
        const question = questions.find((question) => question.id === answer.questionId);

        if (!question) {
            return acc;
        }

        const quizAnswer = question.type === quizQuestionTypeEnum.enumValues[1]
            ? answer.answer.split(',').join('')
            : answer.answer;

        if (question.answerKey === quizAnswer) {
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

        const quizAnswer = question.type === quizQuestionTypeEnum.enumValues[1]
            ? answer.answer.split(',').join('')
            : answer.answer;

        return {
            questionId: question.id,
            answer: quizAnswer,
        };
    }).filter(answer => answer !== null);

    const quizAnswerId = await QuizAnswerRepository.createAnswer(parentPayload, childPayload);

    return {
        answerId: quizAnswerId,
        score: parentPayload.score,
    };
};