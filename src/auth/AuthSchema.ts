import { object, string, pipe, email, minLength, InferInput } from "valibot";

export const loginSchema = object({
    email: pipe(string("your email must be a string"), email("your email must be a valid email")),
    password: pipe(string("your password must be a string"), minLength(8)),
})

export type LoginSchema = InferInput<typeof loginSchema>;

export const registerSchema = object({
    name: string("your name must be a string"),
    email: pipe(string("your email must be a string"), email("your email must be a valid email")),
    password: pipe(string("your password must be a string"), minLength(8))
})

export type RegisterSchema = InferInput<typeof registerSchema>;

export const refreshSchema = object({
    refresh_token: string("your refresh token must be a string"),
})