'use server';

import { ResetSchema } from '@/types/reset-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '../db/neon-http';
import { eq } from 'drizzle-orm';
import { users } from '../schema';
import { generatePasswordResetToken } from './tokens';
import { sendPasswordResetEmail } from './email';

const actionClient = createSafeActionClient();

export const resetPassword = actionClient
    .schema(ResetSchema)
    .action(async ({ parsedInput: { email } }) => {
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });
        if (!existingUser) {
            return { error: 'User not found' };
        }

        const passwordResetToken = await generatePasswordResetToken(email);
        if (!passwordResetToken) {
            return { error: 'Token not generated' };
        }
        const response = await sendPasswordResetEmail(
            passwordResetToken[0].email,
            passwordResetToken[0].token
        );
        if (response?.success) return { success: 'Reset Email Sent' };
        if (response?.error) return { error: response?.error };
    });
