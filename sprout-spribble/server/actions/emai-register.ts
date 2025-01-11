'use server';

import { db } from '@/server';
import { RegisterSchema } from '@/types/register-schema';
import { createSafeActionClient } from 'next-safe-action';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from '@/server/schema';
import { generateEmailVerifyToken } from './tokens';
import { sendVerificationEmail } from './email';

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
    .schema(RegisterSchema)
    .action(async ({ parsedInput: { email, password, name } }) => {
        const hashPassword = await bcrypt.hash(password, 10);

        const exitingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (exitingUser) {
            if (!exitingUser.emailVerified) {
                const verificationToken = await generateEmailVerifyToken(email);
                const response = await sendVerificationEmail(
                    verificationToken[0].email,
                    verificationToken[0].token
                );
                if (response?.success) return { success: 'Email Confirmation resend' };
                if (response?.error) return { error: response?.error };
            }
            return { error: 'Email already use' };
        }

        // Logic for when the user is not registered
        await db.insert(users).values({
            name,
            email,
            password: hashPassword,
        });

        const verificationToken = await generateEmailVerifyToken(email);
        const response = await sendVerificationEmail(
            verificationToken[0].email,
            verificationToken[0].token
        );
        if (response?.success) return { success: 'Confirmation Email Sent!' };
        if (response?.error) return { error: response?.error };
    });
