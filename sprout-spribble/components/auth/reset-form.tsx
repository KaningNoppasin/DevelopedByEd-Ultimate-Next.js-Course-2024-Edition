'use client';

import { useForm } from 'react-hook-form';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
} from '../ui/form';
import { AuthCard } from './auth-card';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useAction } from 'next-safe-action/hooks';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { resetPassword } from '@/server/actions/password-reset';
import { ResetSchema } from '@/types/reset-schema';

export const ResetForm = () => {
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: '',
        },
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { execute, status } = useAction(resetPassword, {
        onSuccess({ data }) {
            if (data?.error) setError(data?.error);
            if (data?.success) setSuccess(data?.success);
        },
    });

    const onsubmit = (values: z.infer<typeof ResetSchema>) => {
        execute(values);
    };
    return (
        <AuthCard
            cardTitle="Forgot your password?"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
            showSocials={false}
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="email"
                                                id="email"
                                                disabled={status === 'executing'}
                                                placeholder="example@email.com"
                                                autoComplete="email"
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormSuccess message={success} />
                            <FormError message={error} />
                        </div>
                        <Button
                            type="submit"
                            className={cn(
                                'w-full my-2',
                                status === 'executing' ? 'animate-pulse' : ''
                            )}
                        >
                            Reset Password
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    );
};
