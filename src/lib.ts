import { env } from "bun";
import { HTTPException } from "hono/http-exception";
import { jwt, sign } from "hono/jwt"
import {tryit} from "radash"

export type JWTCreateOptions = {
    sub: string;
    email: string;
    type?: 'access' | 'refresh';
}

export const jwtware = jwt({ secret: env.JWT_ACCESS_KEY! })

export const createJwt = async ({
    sub,
    email,
    type = 'access',
  }: JWTCreateOptions) => {
    
    const [err, jwt] = await tryit(sign)(
      {
        sub,
        email,
        exp:
          type === 'access'
            ? Math.floor(Date.now() / 1000) + 5 * 60
            : Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        iat: Date.now() / 1000,
        nbf: Date.now() / 1000,
      },
      type === 'access' ? env.JWT_ACCESS_KEY! : env.JWT_REFRESH_KEY!
    );
    if (err) {
      throw new HTTPException(500, { message: `failed to create ${type} token` });
    }
  
    return jwt;
  }