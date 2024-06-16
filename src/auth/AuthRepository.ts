import { tryit } from "radash"
import { db } from "../db"
import { eq } from "drizzle-orm"
import { InsertUser, users } from "../schema"
import { customLogger } from "../utils/customLogger"
import { HTTPException } from "hono/http-exception"

export const create = async(payload: InsertUser) => { 
    await verifyEmailAvaibility(payload.email)
    const [err] = await tryit(async() => db.insert(users).values(payload))()

    if(err) {
        customLogger("Create user error: ", `Email: ${payload.email} failed to create user`)
        throw new HTTPException(500, {
            message: "failed to create user"
        })
    }
}

export const verifyEmailAvaibility = async(email: string) => {
    const [err, user] = await tryit(async() => db.query.users.findFirst({
        where: eq(users.email, email)
    }))()

    if(err) {
        customLogger("Verify email availability error: ", `Email: ${email} failed to verify email availability`)
        throw new HTTPException(500, {
            message: 'failed to verify email availability',
            cause: err,
        });
    }

    if(user) {
        customLogger("Verify email availability error: ", `Email: ${email} already exists`)
        throw new HTTPException(400, {
            message: 'email already exists'
        })
    }
}

export const showByEmail = async (email: string) => {
    const [err, user] = await tryit(async() => db.query.users.findFirst({
        where: eq(users.email, email)
    }))()
    
    if(err) {
        customLogger("Show user by email error: ", `Email: ${email} failed to show user`)
        throw new HTTPException(500, {
            message: 'failed to show user',
            cause: err
        })
    }

    if(!user) {
        customLogger("Show user by email error: ", `Email: ${email} not found`)
        throw new HTTPException(404, {
            message: "user not found"
        })
    }

    return user
}