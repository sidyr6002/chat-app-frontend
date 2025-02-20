import { z } from "zod";

export const signUpSchema = z
    .object({
        email: z.string({ required_error: 'Email is required' }).email({
            message: 'Please enter a valid email address',
        }),
        username: z
            .string({ required_error: 'Username is required' })
            .regex(
                /^[a-zA-Z][a-zA-Z0-9_]{3,}$/,
                'Username must be at least 4 characters long and can only contain letters, numbers, and underscores.'
            ),
        password: z
            .string({ required_error: 'Password is required' })
            .min(8, {
                message: 'Password must be at least 8 characters',
            })
            .max(128, {
                message: 'Password must be less than 128 characters',
            })
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                {
                    message:
                        'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
                }
            ),
        confirmPassword: z.string({
            required_error: 'Confirm Password is required',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });