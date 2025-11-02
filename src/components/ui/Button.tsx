import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
  ghost: "text-blue-600 hover:bg-blue-50",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ className, variant = "primary", type = "button", ...props }, ref) {
  return <button ref={ref} type={type} className={`rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer disabled:pointer-events-none disabled:opacity-60 ${variantClasses[variant]} ${className}`} {...props} />;
});
