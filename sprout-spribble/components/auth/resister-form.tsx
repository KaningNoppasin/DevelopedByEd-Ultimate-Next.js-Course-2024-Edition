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
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { RegisterSchema } from '@/types/register-schema';
import { useState } from 'react';
import { useAction } from 'next-safe-action/hooks';
import { emailRegister } from '@/server/actions/emai-register';
import { FormSuccess } from './form-success';
import { FormError } from './form-error';

export const RegisterForm = () => {
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const { execute, status } = useAction(emailRegister, {
        onSuccess({ data }) {
            if (data?.error) setError(data?.error);
            if (data?.success) setSuccess(data?.success);
        },
    });

    const onsubmit = (values: z.infer<typeof RegisterSchema>) => {
        execute(values);
    };
    return (
        <AuthCard
            cardTitle="Create an account 🎉"
            backButtonHref="/auth/login"
            backButtonLabel="Already have an account"
            showSocials
        >
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)}>
                        <div>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="name"
                                                placeholder="Your username"
                                                autoComplete="name"
                                            />
                                        </FormControl>
                                        <FormDescription />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            Register
                        </Button>
                    </form>
                </Form>
            </div>
        </AuthCard>
    );
};
