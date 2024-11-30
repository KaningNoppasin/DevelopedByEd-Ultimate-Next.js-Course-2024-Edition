'use server';

import { LoginSchema } from '@/types/login-schema';
import { createSafeActionClient } from 'next-safe-action';
import { db } from '@/server';
import { eq } from 'drizzle-orm';
import { users } from '../schema';

const actionClient = createSafeActionClient();

export const emailSignIn = actionClient
    .schema(LoginSchema)
    .action(async ({ parsedInput: { email, password, code } }) => {
        // Check if the user is in database
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (existingUser?.email !== email){
            return { error: "Email not found" }
        }
        console.log(email, password, code);
        return { success: email };
    });
