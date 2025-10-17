import { betterAuth, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "../db";
import {
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../email";
import { SIGN_UP_PATH } from "./constants";

export const auth = betterAuth({
  user: {
    additionalFields: {
      // add custom user fields here then run `npm run auth:generate` to create the schema
      // then run `npm run db:push`
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ user, url });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmailVerificationEmail({ user, url });
    },
  },
  socialProviders: {
    // add social providers here
    // github: {
    //     ...
    //     mapProfileToUser: (profile) => ({
    //         // map your custom fields defined above here
    //         someCustomField: profile...
    //     })
    // }
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 min
    },
  },
  trustedOrigins: ["http://localhost:3000"],
  plugins: [nextCookies()],
  database: drizzleAdapter(db, { provider: "pg" }),
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path.startsWith(SIGN_UP_PATH)) {
        const user =
          ctx.context.newSession?.user ??
          ({
            name: ctx.body.name,
            email: ctx.body.email,
          } as User);
        if (user != null) {
          await sendWelcomeEmail({ user });
        }
      }
    }),
  },
});
