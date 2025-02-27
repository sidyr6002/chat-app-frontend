import { Check, X } from "lucide-react";
import React, { useMemo } from "react";

import { PasswordInput } from "./password-input";


const PasswordStrengthInput = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, id, placeholder, value, onChange, ...props }, ref) => {

        const checkStrength = (pass: string) => {
            const requirements = [
                { regex: /.{8,}/, text: "At least 8 characters" },
                { regex: /[0-9]/, text: "At least 1 number" },
                { regex: /[a-z]/, text: "At least 1 lowercase letter" },
                { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
                { regex: /[@$!%*?&]/, text: "At least 1 special character" },
            ];

            return requirements.map((req) => ({
                met: req.regex.test(pass),
                text: req.text,
            }));
        };

        const strength = checkStrength(value as string);

        const strengthScore = useMemo(() => {
            return strength.filter((req) => req.met).length;
        }, [strength]);

        const getStrengthColor = (score: number) => {
            if (score === 0) return "bg-border";
            if (score <= 1) return "bg-red-500";
            if (score <= 2) return "bg-orange-500";
            if (score <= 3) return "bg-amber-500";
            if (score <= 4) return "bg-emerald-500";
            return "bg-green-500";
        };

        const getStrengthText = (score: number) => {
            if (score === 0) return "Enter a password";
            if (score <= 2) return "Weak password";
            if (score === 4) return "Medium password";
            return "Strong password";
        };

        return (
            <div>
                {/* Password input field with toggle visibility button */}
                <PasswordInput
                    id={id}
                    className={className}
                    ref={ref}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete="new-password"
                    {...props}
                />

                {/* Password strength indicator */}
                <div
                    className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border"
                    role="progressbar"
                    aria-valuenow={strengthScore}
                    aria-valuemin={0}
                    aria-valuemax={4}
                    aria-label="Password strength"
                >
                    <div
                        className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                        style={{ width: `${(strengthScore / 5) * 100}%` }}
                    />
                </div>

                {/* Password strength description */}
                <p id={`${id}-description`} className="mb-2 text-sm font-medium text-foreground">
                    {getStrengthText(strengthScore)}. Must contain:
                </p>

                {/* Password requirements list */}
                <ul className="space-y-1.5" aria-label="Password requirements">
                    {strength.map((req, index) => (
                        <li key={index} className="flex items-center gap-2">
                            {req.met ? (
                                <Check size={16} className="text-green-500" aria-hidden="true" />
                            ) : (
                                <X size={16} className="text-muted-foreground/80" aria-hidden="true" />
                            )}
                            <span className={`text-xs ${req.met ? "text-green-600" : "text-muted-foreground"}`}>
                                {req.text}
                                <span className="sr-only">
                                    {req.met ? " - Requirement met" : " - Requirement not met"}
                                </span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    })
PasswordStrengthInput.displayName = "PasswordStrengthInput";

export { PasswordStrengthInput };
