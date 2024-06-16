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

export const updateProfile = async(email: string, payload: Partial<InsertUser>) => {
    const [err, user] = await tryit(async() => (await db.update(users).set(payload).where(eq(users.email, email)).returning()).at(0))()

    if(err) {
        customLogger("Update profile user error: ", `Email: ${email} failed to update profile`)
        throw new HTTPException(500, {
            message: "failed to update profile"
        })
    }

    return user
}

export const changePassword = async(email: string, password: string) => {
    const [err, user] = await tryit(async() => (await db.update(users).set({ password }).where(eq(users.email, email)).returning()).at(0))()

    if(err) {
        customLogger("Change password user error: ", `Email: ${email} failed to change password`)
        throw new HTTPException(500, {
            message: "failed to change password"
        })
    }

    return user
}