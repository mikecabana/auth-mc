import { stripe } from "@better-auth/stripe";
import { betterAuth, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import {
  admin as adminPlugin,
  organization,
  twoFactor,
} from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";
import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { member } from "../db/schema";
import {
  sendDeleteAccountVerification,
  sendEmailVerificationEmail,
  sendOrganizationInviteEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../email";
import { stripeClient } from "../stripe";
import { STRIPE_PLANS } from "../stripe/plans";
import { SIGN_UP_PATH } from "./constants";
import { ac, admin, user } from "./permissions";

export const auth = betterAuth({
  appName: "Better Auth Template",
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
  plugins: [
    nextCookies(),
    twoFactor(),
    passkey(),
    adminPlugin({
      ac,
      roles: {
        admin,
        user,
      },
    }),
    organization({
      sendInvitationEmail: ({ email, organization, inviter, invitation }) =>
        sendOrganizationInviteEmail({
          email,
          organization,
          inviter: inviter.user,
          invitation,
        }),
    }),
    stripe({
      stripeClient,
      stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
      createCustomerOnSignUp: true,
      subscription: {
        enabled: true,
        plans: STRIPE_PLANS,
        authorizeReference: async ({ user, referenceId, action }) => {
          const memberItem = await db.query.member.findFirst({
            where: and(
              eq(member.organizationId, referenceId),
              eq(member.userId, user.id),
            ),
          });

          if (
            action === "upgrade-subscription" ||
            action === "cancel-subscription" ||
            action === "restore-subscription"
          ) {
            return memberItem?.role === "owner";
          }

          return memberItem != null;
        },
      },
    }),
  ],
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
  databaseHooks: {
    session: {
      create: {
        before: async (userSession) => {
          const membership = await db.query.member.findFirst({
            where: eq(member.userId, userSession.userId),
            orderBy: desc(member.createdAt),
            columns: { organizationId: true },
          });

          return {
            data: {
              ...userSession,
              activeOrganizationId: membership?.organizationId,
            },
          };
        },
      },
    },
  },
});
