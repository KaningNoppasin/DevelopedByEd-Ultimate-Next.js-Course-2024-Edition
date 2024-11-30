import { z } from 'zod';

export const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4, {
        message: 'Password must be at least 8 characters long',
    }),
    name: z.string().min(4, {
        message: "Please add a new with at least 4 characters"
    })
});
