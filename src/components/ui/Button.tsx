type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const baseClasses =
  "relative inline-flex cursor-pointer select-none items-center justify-center rounded-[6px] border-[2.5px] border-black px-3 py-[0.55rem] text-sm font-semibold tracking-tight text-neutral-900 shadow-[4px_4px_0px_rgba(0,0,0,0.7)] transition-shadow duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6f4f1] hover:shadow-[2px_2px_0px_rgba(0,0,0,0.65)] active:shadow-[1px_1px_0px_rgba(0,0,0,0.6)] disabled:pointer-events-none disabled:opacity-60 font-mono";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#ffe27c] text-neutral-900 hover:bg-neutral-900 hover:text-[#ffe27c] focus-visible:ring-offset-b[#ffe27c]",
  secondary:
    "bg-[#d2f1f4] text-neutral-900 hover:bg-neutral-900 hover:text-[#d2f1f4] focus-visible:ring-offset[#d2f1f4]",
  danger:
    "bg-[#ffb3b3] text-neutral-900 hover:bg-neutral-900 hover:text-[#ffb3b3] focus-visible:ring-offset-[#ffb3b3]",
  ghost:
    "bg-[#f7f3ee] text-neutral-900 hover:bg-neutral-900 hover:text-[#f7f3ee] focus-visible:ring-offset-parc[#f7f3ee]",
};

export function Button({
  variant = "primary",
  type = "button",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
