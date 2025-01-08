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
import { cn } from '~/lib/utils';

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

const SignInPage = () => {
    const form = useForm<z.infer<typeof signInSchema>>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(signInSchema),
    });

    function onSubmit(values: z.infer<typeof signInSchema>) {
        console.log(values);
    }

    return (
        <div className="w-full flex justify-center">
            <Card className="w-full sm:w-96">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Enter your credentials to sign in
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
                                        <div className="flex justify-between place-items-baseline">
                                            <FormLabel
                                                htmlFor="password"
                                                className="text-sm text-neutral-800"
                                            >
                                                Password
                                            </FormLabel>
                                            <a
                                                href="#"
                                                className="text-xs text-neutral-600 hover:underline"
                                            >
                                                Forgot Password?
                                            </a>
                                        </div>
                                        <FormControl>
                                            <PasswordInput
                                                id="password"
                                                placeholder="••••••••"
                                                className={cn(
                                                    'rounded-full shadow-inner shadow-zinc-700/15 focus-visible:ring-0 ',
                                                    fieldState.error &&
                                                        'border-rose-600'
                                                )}
                                                {...field}
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
                            <div className="space-y-2 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full rounded-full hover:bg-opacity-70"
                                >
                                    Sign In
                                </Button>
                                <div className="flex justify-center text-sm">
                                    <p>
                                        Don&apos;t have an account?{' '}
                                        <a
                                            href="/sign-up"
                                            className="text-neutral-600 hover:text-neutral-800 hover:underline hover:underline-offset-2"
                                        >
                                            Sign Up
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

export default SignInPage;
