import { betterAuth, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";
import { db } from "../db";
import {
  sendDeleteAccountVerification,
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
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, url, newEmail }) => {
        await sendEmailVerificationEmail({
          url,
          user: { ...user, email: newEmail },
        });
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        await sendDeleteAccountVerification({ user, url });
      },
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
  plugins: [nextCookies(), twoFactor()],
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
