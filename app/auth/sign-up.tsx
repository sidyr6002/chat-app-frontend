import { useEffect, useState } from 'react';
import { LoaderFunction, useLoaderData, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema } from 'common/sing-up-schema';
import axios from 'axios';
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
import { PasswordInput } from '~/components/password-input';
import { PasswordStrengthInput } from '~/components/password-strength-input';
import { cn } from '~/lib/utils';
import useDebounce from '~/hooks/use-debounce';
import BackendUrl from '~/types/backend-url';

export const loader: LoaderFunction = () => {
    const data: BackendUrl = {
      backendUrl: process.env.BACKEND_URL || '', 
    };

    return Response.json(data);
};

type UsernameStatus = 'checking' | 'available' | 'taken' | null;

const SignUpPage = () => {
    const { backendUrl } = useLoaderData<BackendUrl>();
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const username = form.watch('username');
    const debouncedUsername = useDebounce(username, 500);
    const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [serverError, setServerError] = useState<string | null>(null);

    useEffect(() => {
        if (debouncedUsername && debouncedUsername.length <= 3) {
          setUsernameStatus(null);
          return;
        }

        if (debouncedUsername && debouncedUsername.trim() !== '') {
          setUsernameStatus('checking');
          const checkUsernameAvailability = async () => {
            try {
              const response = await fetch(
                `${backendUrl}/usernames/check-availability?username=${encodeURIComponent(debouncedUsername)}`
              );
              const data = await response.json();
              const isAvailable = data.isAvailable;
              setUsernameStatus(isAvailable ? 'available' : 'taken');
            } catch (error) {
              console.error('Error checking username:', error);
              setUsernameStatus(null);
            }
          };

          checkUsernameAvailability();
        } else {
          setUsernameStatus(null);
        }
      }, [debouncedUsername, backendUrl]);

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        if (values.password !== values.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const signUpData = {
            username: values.username,
            email: values.email,
            password: values.password,
        };

        setIsSubmitting(true);
        setServerError(null);

        try {
            const { data } = await axios.post(
                `${backendUrl}/auth/signup`,
                signUpData,
                {   
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            )

            console.log(data);

            navigate('/sign-in');
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setServerError(error.response?.data.message || 'Sign up failed. Please try again.');
            } else {
                setServerError('Something unexpected happened. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full flex justify-center">
            <Card className="w-full sm:w-96">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl text-blue-600">Sign Up</CardTitle>
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
                                                placeholder='john@example.com'
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
                                name="username"
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel
                                            htmlFor="username"
                                            className="text-sm text-neutral-800"
                                        >
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="username"
                                                type="text"
                                                placeholder="johndoe"
                                                className={cn(
                                                    'rounded-full shadow-inner shadow-zinc-700/15 focus-visible:ring-0',
                                                    fieldState.error && 'ring ring-rose-600'
                                                )}
                                                {...field}
                                                aria-invalid={
                                                    fieldState.error
                                                        ? 'true'
                                                        : 'false'
                                                }
                                                aria-describedby="username-error"
                                            />
                                        </FormControl>
                                        <FormMessage
                                            id="username-error"
                                            className="text-xs"
                                        />
                                        {/* Display debounced availability message */}
                                        {usernameStatus === 'checking' && (
                                            <p className="text-xs text-neutral-500">
                                                Checking availability...
                                            </p>
                                        )}
                                        {usernameStatus === 'available' && (
                                            <p className="text-xs text-green-600">
                                                Username is available
                                            </p>
                                        )}
                                        {usernameStatus === 'taken' && (
                                            <p className="text-xs text-rose-600">
                                                Username is already taken
                                            </p>
                                        )}
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

                            {/* Server error display, if any */}
                            {serverError && <p className="text-xs font-semibold text-rose-600">{serverError}</p>}

                            <div className="space-y-2 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full rounded-full bg-blue-600 hover:bg-blue-700 disabled:cursor-not-allowed"
                                    disabled={isSubmitting}
                                >
                                    {
                                        isSubmitting ? (
                                            <span className='flex gap-1 justify-center align-center'>
                                                <Loader2 style={{ height: "20px", width: "20px" }} className="mr-1 animate-spin" />
                                                Signing Up
                                            </span>
                                        ) : (
                                            <span>
                                                Sign Up
                                            </span>
                                        )
                                    }
                                </Button>
                                <div className="flex justify-center text-sm">
                                    <p>
                                        Already have an account?{' '}
                                        <a
                                            href="/sign-in"
                                            className="text-blue-500 hover:text-blue-600 hover:underline hover:underline-offset-2"
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
