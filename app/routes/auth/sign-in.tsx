import { useState } from 'react';
import {
    ActionFunction,
    redirect,
    useSubmit,
} from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import signInSchema from 'common/signin-schema';
import { Loader2 } from 'lucide-react';

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
import { PasswordInput } from '~/components/inputs/password-input';
import { cn } from '~/lib/utils';
import { commitSession, getSession } from '~/session.server';

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    const validation = signInSchema.safeParse({
        email,
        password,
    });

    if (!validation.success) {
        return Response.json(
            { errors: validation.error.format() },
            { status: 400 }
        );
    }

    try {
        const backendUrl = process.env.BACKEND_URL || '';

        const response = await axios.post(
            `${backendUrl}/auth/signin`,
            { email, password },
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        );

        const { accessToken, refreshToken } = response.data;

        console.log('Access Token:', accessToken);
        console.log('Refresh Token:', refreshToken);

        const session = await getSession(request);
        session.set('accessToken', accessToken);
        session.set('refreshToken', refreshToken);

        return redirect("/", {
            headers: {
                'Set-Cookie': await commitSession(session),
            },
        });
    } catch (error) {
        console.error('Sign-in error:', error);
        return Response.json(
            { error: "Invalid credentials or server error." },
            { status: 401 }
        );
    }
};

const SignInPage = () => {
    const submit = useSubmit();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    async function onSubmit(values: z.infer<typeof signInSchema>) {
        setIsSubmitting(true);
        await submit(values, { method: 'post' });        
        setIsSubmitting(false);
    }

    return (
        <div className="w-full flex justify-center">
            <Card className="w-full sm:w-96">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-blue-600">
                        Welcome back
                    </CardTitle>
                    <CardDescription>
                        Enter your credentials to sign in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                            method="post"
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
                                                placeholder="jhon@example.com"
                                                className={cn(
                                                    'rounded-full shadow-inner shadow-zinc-700/15 focus-visible:ring-0',
                                                    fieldState.error &&
                                                        'ring ring-rose-600'
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
                                                    'rounded-full shadow-inner shadow-zinc-700/15 focus-visible:ring-0',
                                                    fieldState.error &&
                                                        'ring ring-rose-600'
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
                                    className="w-full rounded-full bg-blue-600 hover:bg-blue-700"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span>
                                            <Loader2
                                                className="mr-2 animate-spin"
                                                style={{
                                                    height: '16px',
                                                    width: '16px',
                                                }}
                                            />
                                            Signing In
                                        </span>
                                    ) : (
                                        <span>Sign In</span>
                                    )}
                                </Button>
                                <div className="flex justify-center text-sm">
                                    <p>
                                        Don&apos;t have an account?{' '}
                                        <a
                                            href="/sign-up"
                                            className="text-blue-500 hover:text-blue-600 hover:underline hover:underline-offset-2"
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
