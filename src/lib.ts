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