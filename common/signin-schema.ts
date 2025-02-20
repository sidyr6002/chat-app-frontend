import { z } from "zod";

const signInSchema = z.object({
    email: z.string({ required_error: 'Email is required' }).email({
        message: 'Please enter a valid email address',
    }),
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
});

export default signInSchema;