import { pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/********** SCHEMA **********
 * @Table users
 * @PrimaryKey id
 * @Fields id, name, email, password, photo, createdAt, updatedAt
 */

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    email: varchar('email', { length: 50 }).unique().notNull(),
    password: varchar('password', { length: 256 }).notNull(),
    photo: varchar('photo', { length: 256 }).default("default.jpg"),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

export type SelectUser = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/********** SCHEMA **********
 * @Table screening_questions
 * @PrimaryKey id
 * @Fields id, question, createdAt, updatedAt
 */

export const screeningQuestions = pgTable('screening_questions', {
    id: serial('id').primaryKey(),
    question: text('question').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

export type SelectScreeningQuestion = typeof screeningQuestions.$inferSelect;
export type InsertScreeningQuestion = typeof screeningQuestions.$inferInsert;

/********** SCHEMA **********
 * @Table screening_answers
 * @PrimaryKey id
 * @Fields id, questionId, answer, createdAt, updatedAt
 */

export const screeningAnswers = pgTable('screening_answers', {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull().references(() => users.id),
    score: serial('score').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
})

export type SelectScreeningAnswer = typeof screeningAnswers.$inferSelect;
export type InsertScreeningAnswer = typeof screeningAnswers.$inferInsert;

/********** SCHEMA **********
 * @Table screening_answer_details
 * @PrimaryKey id
 * @Fields id, questionId, answer, createdAt, updatedAt
 */

export const screeningAnswerDetailEnum = pgEnum('screening_answer_enum', ['yes', 'no', 'not_sure']);

export const screeningAnswerDetail = pgTable('screening_answer_details', {
    id: serial('id').primaryKey(),
    answerId: serial('answer_id').notNull().references(() => screeningAnswers.id),
    questionId: serial('question_id').notNull().references(() => screeningQuestions.id),
    answer: screeningAnswerDetailEnum('answer').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

export type SelectScreeningAnswerDetail = typeof screeningAnswerDetail.$inferSelect;
export type InsertScreeningAnswerDetail = typeof screeningAnswerDetail.$inferInsert;

/********** SCHEMA **********
 * @Table quiz_questions
 * @PrimaryKey id
 * @Fields id, type, question, answerKey, createdAt, updatedAt
 */

export const quizQuestionTypeEnum = pgEnum('quiz_question_type_enum', ['text', 'audio', 'image']);
export const quizQuestionAnswerTypeEnum = pgEnum('quiz_question_answer_type_enum', ['multiple', 'scrumble', 'handwriting']);

export const quizQuestions = pgTable('quiz_questions', {
    id: serial('id').primaryKey(),
    type: quizQuestionTypeEnum('type').notNull(),
    question: text('question').notNull(),
    answerType: quizQuestionAnswerTypeEnum('answer_type').notNull(),
    answerList: text('answer_list').notNull(),
    answerKey: text('answer_key').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

export type SelectQuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

/********** SCHEMA **********
 * @Table quiz_answers
 * @PrimaryKey id
 * @Fields id, userId, questionId, answer, createdAt, updatedAt
 */

export const quizAnswers = pgTable('quiz_answers', {
    id: serial('id').primaryKey(),
    userId: serial('user_id').notNull().references(() => users.id),
    score: serial('score').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

export type SelectQuizAnswer = typeof quizAnswers.$inferSelect;
export type InsertQuizAnswer = typeof quizAnswers.$inferInsert;

/********** SCHEMA **********
 * @Table quiz_answer_details
 * @PrimaryKey id
 * @Fields id, answerId, questionId, answer, createdAt, updatedAt
 */

export const quizAnswerDetail = pgTable('quiz_answer_details', {
    id: serial('id').primaryKey(),
    answerId: serial('answer_id').notNull().references(() => quizAnswers.id),
    questionId: serial('question_id').notNull().references(() => quizQuestions.id),
    answer: text('answer').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .$onUpdate(() => new Date()),
});

export type SelectQuizAnswerDetail = typeof quizAnswerDetail.$inferSelect;
export type InsertQuizAnswerDetail = typeof quizAnswerDetail.$inferInsert;