import * as QuizQuestionRepository from './QuizQuestionRepository';

export const getQuiz = async() => {
    const questions = await QuizQuestionRepository.get();

    const response = questions.map((question) => {
        return {
            id: question.id,
            type: question.type,
            question: question.question,
            choiceType: question.answerType,
            choices: question.answerList.split(',').sort(() => Math.random() - 0.5),
        };
    })

    return response
}