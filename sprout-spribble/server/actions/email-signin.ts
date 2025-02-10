'use server';

import { LoginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server/db/neon-http';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import { generateEmailVerifyToken } from './tokens';
import { sendVerificationEmail } from './email';
import { signIn } from '@/server/auth';
import { AuthError } from 'next-auth';

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
    .schema(LoginSchema)
    .action(async ({ parsedInput: { email, password, code } }) => {
        try {
            // Check if the user is in database
            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, email),
            });

            if (existingUser?.email !== email) {
                return { error: 'Email not found' };
            }

            // If the user is not verified
            if (!existingUser?.emailVerified) {
                const verificationToken = await generateEmailVerifyToken(
                    existingUser?.email
                );
                const response = await sendVerificationEmail(
                    verificationToken[0].email,
                    verificationToken[0].token
                );
                if (response?.success)
                    return { success: 'Confirmation Email Sent!' };
                if (response?.error) return { error: response?.error };
            }
            console.log(email, password, code);

            // TODO: 2FA

            await signIn('credentials', {
                email,
                password,
                // redirectTo: '/',
                redirect: false,
            });

            return { success: 'User Signed In!' };
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case 'OAuthSignInError':
                        return { error: error.message };
                    case 'CredentialsSignin':
                        return { error: error.message };
                    case 'AccessDenied':
                        return { error: error.message };
                    default:
                        return { error: 'Something went wrong' };
                }
            }
            return { error: 'Something went wrong' };
        }
    });
