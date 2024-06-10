import { object, string, pipe, email, minLength, InferInput, forward, check } from "valibot";

export const loginSchema = object({
    email: pipe(string("your email must be a string"), email("your email must be a valid email")),
    password: pipe(string("your password must be a string"), minLength(8)),
})

export type LoginSchema = InferInput<typeof loginSchema>;

export const registerSchema = pipe(object({
    name: string("your name must be a string"),
    email: pipe(string("your email must be a string"), email("your email must be a valid email")),
    password: pipe(string("your password must be a string"), minLength(8)),
    confirm_password: string()
}), forward(
    check(
        (input) => input.password === input.confirm_password,
        'The confirm password doesn\'t match'
    ),
    ['confirm_password']
))

export type RegisterSchema = InferInput<typeof registerSchema>;

export const refreshSchema = object({
    refresh_token: string("your refresh token must be a string"),
})