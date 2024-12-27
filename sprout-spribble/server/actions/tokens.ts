'use server';
import { eq } from 'drizzle-orm';
import { emailTokens } from './../schema';
import { db } from '@/server';

const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verifyToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.email, email),
        });

        return verifyToken;
    } catch (error) {
        return null;
    }
};

export const generateEmailVerifyToken = async (email: string) => {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // 3600 seconds * 1000 milliseconds = 1 hour

    const existingToken = await getVerificationTokenByEmail(email);

    if (existingToken) {
        await db
            .delete(emailTokens)
            .where(eq(emailTokens.id, existingToken?.id));
    }

    const verificationToken = await db
        .insert(emailTokens)
        // .values({ email: email, token: token, expires: expires });
        .values({ email, token, expires });
    return verificationToken;
};
