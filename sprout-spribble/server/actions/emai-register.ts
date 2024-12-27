'use server';

import { db } from '@/server';
import { RegisterSchema } from '@/types/register-schema';
import { createSafeActionClient } from 'next-safe-action';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { users } from '@/server/schema';
import { generateEmailVerifyToken } from './tokens';

const actionClient = createSafeActionClient();

export const emailRegister = actionClient
    .schema(RegisterSchema)
    .action(async ({ parsedInput: { email, password, name } }) => {
        const hashPassword = await bcrypt.hash(password, 10);
        console.log(email, hashPassword, name);

        const exitingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (exitingUser) {
            if (!exitingUser.emailVerified) {
                const verificationToken = await generateEmailVerifyToken(email);
                // await sentVerificationToken();

                return { success: 'Email Confirmation resend' };
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
        // await sentVerificationToken();
        return { success: 'Confirmation Email Sent!' };
    });
