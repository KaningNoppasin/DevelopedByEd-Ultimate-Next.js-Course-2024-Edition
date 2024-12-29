'use server';
import getBaseURL from '@/lib/base-url';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL();

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Hello world',
        // react: EmailTemplate({ firstName: 'John' }),
        html: `<p>CLick to <a href='${confirmLink}'>confirm your email</a></p>`,
    });

    if (error) return { error: error.message };
    if (data) return { success: data };
};
