import { vValidator } from "@hono/valibot-validator";
import { ValidationTargets } from "hono";
import { HTTPException } from "hono/http-exception";
import { jwt, sign } from "hono/jwt"
import { tryit } from "radash"

export type JWTCreateOptions = {
  sub: string;
  email: string;
}

export const jwtware = jwt({ secret: process.env.JWT_ACCESS_KEY! })

export const createJwt = async ({
  sub,
  email
}: JWTCreateOptions) => {

  const [err, jwt] = await tryit(sign)(
    {
      sub,
      email,
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      iat: Date.now() / 1000,
      nbf: Date.now() / 1000,
    },
    process.env.JWT_ACCESS_KEY!
  );

  if (err) {
    throw new HTTPException(500, { message: `failed to create token` });
  }

  return jwt;
}

export const validate = (type: keyof ValidationTargets, schema: any) => {
  return vValidator(type, schema, (result, c) => {
    if (!result.success) {
      const errors = result.issues.map(err => {
        return err.message
      })

      throw new HTTPException(400, {
        message: "validation error",
        cause: errors,
      })
    }
  });
}