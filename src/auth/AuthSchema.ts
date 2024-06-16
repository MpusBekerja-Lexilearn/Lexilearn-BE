import { object, string, pipe, email, minLength, InferInput, optional, forward, check } from "valibot";

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

export const updateProfileSchema = object({
    name: string("your name must be a string"),
    confirm_password: pipe(string("your password must be a string"), minLength(8))
})

export type UpdateProfileSchema = InferInput<typeof updateProfileSchema>;

export const changePasswordSchema = pipe(object({
    current_password: string("your current password must be a string"),
    new_password: pipe(string("your new password must be a string"), minLength(8)),
    confirm_password: pipe(string("your password must be a string"), minLength(8))
}), forward(
    check(
        (input) => input.new_password === input.confirm_password,
        'The confirm password doesn\'t match'
    ),
    ['confirm_password']
))

export type ChangePasswordSchema = InferInput<typeof changePasswordSchema>;