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
import { NewPasswordSchema } from '@/types/new-password-schema';
import { newPassword } from '@/server/actions/new-password';

export const NewPasswordForm = () => {
    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
            confirm_password: '',
        },
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { execute, status } = useAction(newPassword, {
        onSuccess({ data }) {
            if (data?.error) setError(data?.error);
            if (data?.success) setSuccess(data?.success);
        },
    });

    const onsubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        execute(values);
    };
    return (
        <AuthCard
            cardTitle="Enter a new password"
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                id="password"
                                                placeholder="********"
                                                autoComplete="current-password"
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="password"
                                                id="confirm_password"
                                                placeholder="********"
                                                autoComplete="current-password"
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
