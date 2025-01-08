import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '~/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '~/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { PasswordInput } from '~/components/password-input';
import { PasswordStrengthInput } from '~/components/password-strength-input';
import { cn } from '~/lib/utils';

const signUpSchema = z
    .object({
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
        confirmPassword: z.string({
            required_error: 'Confirm Password is required',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

const SignUpPage = () => {
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    function onSubmit(values: z.infer<typeof signUpSchema>) {
        console.log(values);
    }

    return (
        <div className="w-full flex justify-center">
            <Card className="w-full sm:w-96">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter the details below and sign up
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel
                                            htmlFor="email"
                                            className="text-sm text-neutral-800"
                                        >
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                className={cn(
                                                    'rounded-full shadow-inner shadow-zinc-700/15 focus-visible:ring-0',
                                                    fieldState.error &&
                                                        'border-rose-600'
                                                )}
                                                {...field}
                                                aria-invalid={
                                                    fieldState.error
                                                        ? 'true'
                                                        : 'false'
                                                }
                                                aria-describedby="email-error"
                                            />
                                        </FormControl>
                                        <FormMessage
                                            id="email-error"
                                            className="text-xs"
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel
                                            htmlFor="password"
                                            className="text-sm text-neutral-800"
                                        >
                                            Password
                                        </FormLabel> 
                                        <FormControl>
                                            <PasswordStrengthInput
                                                id="password"
                                                placeholder="••••••••"
                                                className={cn(
                                                    'rounded-full shadow-inner shadow-zinc-700/15 focus-visible:ring-0 ',
                                                    fieldState.error &&
                                                        'ring ring-rose-500'
                                                )}
                                                value={field.value}
                                                onChange={field.onChange}
                                                aria-invalid={
                                                    fieldState.error
                                                        ? 'true'
                                                        : 'false'
                                                }
                                                aria-describedby="password-error"
                                            />
                                        </FormControl>
                                        <FormMessage
                                            id="password-error"
                                            className="text-xs"
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field, fieldState, formState }) => (
                                    <FormItem>
                                        <FormLabel
                                            htmlFor="confirmPassword"
                                            className="text-sm text-neutral-800"
                                        >
                                            Confirm Password
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                id="confirmPassword"
                                                placeholder="••••••••"
                                                className={cn(
                                                    'rounded-full shadow-inner shadow-zinc-700/15 focus-visible:ring-0',
                                                    formState.isValid
                                                        ? 'focus-visible:ring focus-visible:ring-green-600'
                                                        : 'focus-visible:ring focus-visible:ring-rose-500'
                                                )}
                                                {...field}
                                                aria-invalid={
                                                    fieldState.error
                                                        ? 'true'
                                                        : 'false'
                                                }
                                                aria-describedby="confirmPassword-error"
                                            />
                                        </FormControl>
                                        <FormMessage
                                            id="confirmPassword-error"
                                            className="text-xs"
                                        />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-2 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full rounded-full hover:bg-opacity-70"
                                >
                                    Sign Up
                                </Button>
                                <div className="flex justify-center text-sm">
                                    <p>
                                        Already have an account?{' '}
                                        <a
                                            href="/sign-in"
                                            className="text-neutral-600 hover:text-neutral-800 hover:underline hover:underline-offset-2"
                                        >
                                            Sign In
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUpPage;
