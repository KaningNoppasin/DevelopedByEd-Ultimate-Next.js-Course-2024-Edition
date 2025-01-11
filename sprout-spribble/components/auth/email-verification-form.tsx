'use client';

import { newVerification } from '@/server/actions/tokens';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { AuthCard } from './auth-card';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';

export const EmailVerificationForm = () => {
    const token = useSearchParams().get('token');
    const router = useRouter();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleVerification = useCallback(async () => {
        if (success || error) return;
        if (!token) {
            setError('No token found');
            return;
        }

        const response = await newVerification(token);
        if (response?.error) {
            setError(response?.error);
        }
        if (response?.success) {
            setSuccess(response?.success);
            router.push('/auth/login');
        }
    }, []);

    useEffect(() => {
        handleVerification();
    }, []);
    return (
        <AuthCard
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
            cardTitle="Verify your account"
        >
            <div className="flex items-center flex-col w-full justify-center">
                <p>{!success && !error ? 'Verifying email...' : null}</p>
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>
        </AuthCard>
    );
};
