import { LoginSchema, RegisterSchema } from "./AuthSchema"
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