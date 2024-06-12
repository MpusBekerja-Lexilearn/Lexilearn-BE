import { Hono } from "hono"
import { vValidator } from "@hono/valibot-validator"
import * as AuthSchema from "./AuthSchema"
import * as AuthService from "./AuthService"
import { jwtware } from "../lib"
import { JWTPayload } from "../types"

const auth = new Hono()

auth.post('login', vValidator('json', AuthSchema.loginSchema), async (c) => {
    const data = c.req.valid('json')

    const resp = await AuthService.login(data)

    return c.json({
        code: 200,
        message: "login success",
        ...resp
    }, 200)
})

auth.post('register', vValidator('json', AuthSchema.registerSchema), async (c) => {
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

export default auth