import { Hono } from "hono"
import * as AuthSchema from "./AuthSchema"
import * as AuthService from "./AuthService"
import { jwtware, validate } from "../lib"
import { JWTPayload } from "../types"

const auth = new Hono()

auth.post('login', validate('json', AuthSchema.loginSchema), async (c) => {
    const data = c.req.valid('json')

    const resp = await AuthService.login(data)

    return c.json({
        code: 200,
        message: "login success",
        ...resp
    }, 200)
})

auth.post('register', validate('json', AuthSchema.registerSchema), async (c) => {
    const data = c.req.valid('json')

    await AuthService.register(data)
    
    return c.json({
        code: 201,
        message: "user created"
    }, 201)
})

auth.get('inspect', jwtware, async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload

    const resp = await AuthService.inspect(jwtPayload.email)
    
    return c.json({
        code: 200,
        message: "token is valid",
        ...resp
    }, 200)
})

auth.patch('profile', jwtware, validate('json', AuthSchema.updateProfileSchema), async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload
    const data = c.req.valid('json')

    const resp = await AuthService.updateProfile(jwtPayload.email, data)

    return c.json({
        code: 200,
        message: "profile updated",
        ...resp
    }, 200)
})

auth.patch('change-password', jwtware, validate("json", AuthSchema.changePasswordSchema), async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload
    const data = c.req.valid('json')

    await AuthService.changePassword(jwtPayload.email, data)

    return c.json({
        code: 200,
        message: "password changed"
    }, 200)
})

export default auth