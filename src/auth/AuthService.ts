import { ChangePasswordSchema, LoginSchema, RegisterSchema, UpdateProfileSchema } from "./AuthSchema"
import { HTTPException } from "hono/http-exception"
import { customLogger } from "../utils/customLogger"
import { tryit } from "radash"
import * as AuthRepository from "./AuthRepository"
import { JWTCreateOptions, createJwt } from "../lib"

export const login = async (payload: LoginSchema) => {
    customLogger("Login user: ", `Email: ${payload.email}`)
    const user = await AuthRepository.showByEmail(payload.email)

    const [err, isMatch] = await tryit(Bun.password.verify)(payload.password, user?.password!)

    if(err) {
        customLogger("Login in user error: ", `Email: ${payload.email} failed to verify password`)
        throw new HTTPException(500, {
            message: "failed to verify password"
        })
    }

    if(!isMatch) {
        customLogger("Login in user error: ", `Email: ${payload.email} password not match`)
        throw new HTTPException(401, {
            message: "credential not found"
        })
    }

    const jwtOpt: JWTCreateOptions = {
        sub: user?.id!,
        email: user?.email!
    }

    const accessToken = await createJwt(jwtOpt)

    return {
        data: {
            user: {
                ...user, password: undefined, updatedAt: undefined
            },
            accessToken
        }
    }
}

export const register = async (payload: RegisterSchema) => {
    customLogger("Regitser user: ", `Email: ${payload.email}`)
    const [err, hashPwd] = await tryit(Bun.password.hash)(payload.password)
    
    if(err) {
        customLogger("Regitser user error: ", `Email: ${payload.email} failed to hash password`)
        throw new HTTPException(500, {
            message: "failed to hash password"
        })
    }

    payload.password = hashPwd

    await AuthRepository.create(payload)

    customLogger("Regitser user success: ", `Email: ${payload.email}`)
    return { message: "new user has been created" }
}

export const inspect = async (email: string) => {
    customLogger("Inspect login user: ", `Email: ${email}`)
    const user = await AuthRepository.showByEmail(email)

    return {
        data: {
            ...user, password: undefined, updatedAt: undefined
         }
    }
}

export const updateProfile = async (email: string, payload: UpdateProfileSchema) => {
    customLogger("Update profile user: ", `Email: ${email}`)
    const user = await AuthRepository.showByEmail(email)
    const [err, isMatch] = await tryit(Bun.password.verify)(payload.confirm_password, user?.password!)

    if(err) {
        customLogger("Update profile user error: ", `Email: ${email} failed to verify password`)
        throw new HTTPException(500, {
            message: "failed to verify password"
        })
    }

    if(!isMatch) {
        customLogger("Update profile user error: ", `Email: ${email} password not match`)
        throw new HTTPException(400, {
            message: "wrong password"
        })
    }

    const newUser = await AuthRepository.updateProfile(email, payload)

    customLogger("Update profile user success: ", `Email: ${email}`)
    return {
        data: {
            ...newUser, password: undefined, updatedAt: undefined
        }
    }
}

export const changePassword = async (email: string, payload: ChangePasswordSchema) => {
    customLogger("Change password user: ", `Email: ${email}`)
    const user = await AuthRepository.showByEmail(email)
    const [err, isMatch] = await tryit(Bun.password.verify)(payload.current_password, user?.password!)

    if(err) {
        customLogger("Change password user error: ", `Email: ${email} failed to verify current password`)
        throw new HTTPException(500, {
            message: "failed to verify current password"
        })
    }

    if(!isMatch) {
        customLogger("Change password user error: ", `Email: ${email} current password not match`)
        throw new HTTPException(400, {
            message: "wrong current password"
        })
    }

    const [err2, hashPwd] = await tryit(Bun.password.hash)(payload.new_password)

    if(err2) {
        customLogger("Change password user error: ", `Email: ${email} failed to hash new password`)
        throw new HTTPException(500, {
            message: "failed to hash new password"
        })
    }

    const newUser = await AuthRepository.changePassword(email, hashPwd)

    customLogger("Change password user success: ", `Email: ${email}`)
}