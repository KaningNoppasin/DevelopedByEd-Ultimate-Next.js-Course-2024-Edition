'use server';

import { NewPasswordSchema } from '@/types/new-password-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server';
import { dbPool } from '@/server/db/neon-ws';
import { eq } from 'drizzle-orm';
import { passwordResetTokens, users } from '@/server/schema';
import { getPasswordResetTokenByToken } from './tokens';
import bcrypt from 'bcrypt';

const actionClient = createSafeActionClient();

export const newPassword = actionClient
    .schema(NewPasswordSchema)
    .action(async ({ parsedInput: { password, token } }) => {
        try {
            // Check token
            if (!token) {
                return { error: 'Missing token' };
            }
            const existingToken = await getPasswordResetTokenByToken(token);
            if (!existingToken) {
                return { error: 'Token not found' };
            }

            const hasExpired = new Date(existingToken.expires) < new Date();
            if (hasExpired) {
                return { error: 'Token has expired' };
            }

            const existingUser = await db.query.users.findFirst({
                where: eq(users.email, existingToken.email),
            });
            if (!existingUser) {
                return { error: 'User not found' };
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await dbPool.transaction(async (tx) => {
                await tx
                    .update(users)
                    .set({
                        password: hashedPassword,
                    })
                    .where(eq(users.id, existingUser.id));

                await tx
                    .delete(passwordResetTokens)
                    .where(eq(passwordResetTokens.id, existingToken.id));
            });

            return { success: 'Password updated' };
        } catch {
            return { error: 'Something went wrong' };
        }
    });
