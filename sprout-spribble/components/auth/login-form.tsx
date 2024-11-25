'use client';

import { AuthCard } from './auth-card';

export const LoginForm = () => {
    return (
        <AuthCard
            cardTitle="Welcome back!"
            backButtonHref="/auth/register"
            backButtonLabel="Create a new account"
            showSocials
        >
            <h1>children</h1>
        </AuthCard>
    );
};
