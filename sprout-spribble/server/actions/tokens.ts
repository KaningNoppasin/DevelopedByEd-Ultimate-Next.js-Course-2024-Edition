'use server';
import { eq } from 'drizzle-orm';
import { emailTokens, passwordResetTokens, users } from './../schema';
import { db } from '@/server';

const getVerificationTokenByEmail = async (email: string) => {
    try {
        const verifyToken = await db.query.emailTokens.findFirst({
            where: eq(emailTokens.email, email),
        });

        return verifyToken;
    } catch {
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
        .values({ email, token, expires })
        .returning();
    return verificationToken;
};

export const newVerification = async (token: string) => {
    const existingToken = await db.query.emailTokens.findFirst({
        where: eq(emailTokens.token, token),
    });

    if (!existingToken) return { error: 'Token not found' };
    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) return { error: 'Token has expired' };

    const existingUser = await db.query.users.findFirst({
        where: eq(users.email, existingToken.email),
    });
    if (!existingUser) return { error: 'Email does not exist' };

    await db.update(users).set({
        emailVerified: new Date(),
        email: existingToken.email,
    });

    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
    return { success: 'Email verified' };
};

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const passwordResetToken = await db.query.passwordResetTokens.findFirst({
            where: eq(passwordResetTokens?.token, token)
        })
        return passwordResetToken;
    } catch {
        return null;
    }
};
