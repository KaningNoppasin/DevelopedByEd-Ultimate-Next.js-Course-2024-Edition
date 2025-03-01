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
import { LoginSchema } from '@/types/login-schema';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAction } from 'next-safe-action/hooks';
import { emailSignIn } from '@/server/actions/email-signin';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';
import { redirect } from 'next/navigation';

export const LoginForm = () => {
    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { execute, status } = useAction(emailSignIn, {
        onSuccess({ data }) {
            if (data?.error) setError(data?.error);
            if (data?.success) setSuccess(data?.success);
        },
    });

    useEffect(() => {
        if (success === 'User Signed In!') {
            redirect('/');
        }
    }, [success])

    const onsubmit = (values: z.infer<typeof LoginSchema>) => {
        execute(values);
    };
    return (
        <AuthCard
            cardTitle="Welcome back!"
            backButtonHref="/auth/register"
            backButtonLabel="Create a new account"
            showSocials
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
                                                placeholder="example@email.com"
                                                autoComplete="email"
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <FormSuccess message={success} />
                            <FormError message={error} />
                            <Button size={'sm'} variant={'link'} asChild>
                                <Link href={'/auth/reset'}>
                                    Forgot your password
                                </Link>
                            </Button>
                        </div>
                        <Button
                            type="submit"
                            className={cn(
                                'w-full my-2',
                                status === 'executing' ? 'animate-pulse' : ''
                            )}
                        >
                            Login
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    );
};
