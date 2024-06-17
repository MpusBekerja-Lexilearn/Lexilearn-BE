import * as QuizQuestionRepository from './QuizQuestionRepository';

export const getQuiz = async() => {
    const questions = await QuizQuestionRepository.get();
    const answerList = questions?.answerList.split(',');

    return {
        ...questions,
        answerList
    };
}