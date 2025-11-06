type AlertVariant = "default" | "error";
type AlertProps = {
  variant?: AlertVariant;
  children?: React.ReactNode;
  className?: React.ComponentProps<"div">["className"];
};

const baseClasses =
  "rounded-[6px] border-[2.5px] border-dashed border-black px-3 py-2 font-mono text-sm font-semibold leading-relaxed shadow-[5px_5px_0px_rgba(0,0,0,0.3)]";
const variantClasses: Record<AlertVariant, string> = {
  default: "bg-[#f8f5ef] text-neutral-900",
  error: "bg-[#ffe7e7] text-[#5b1b1b]",
};

export function Alert({
  variant = "default",
  children,
  className = "w-full m-auto",
}: AlertProps) {
  if (!children) return null;

  return (
    <div
      role={variant === "error" ? "alert" : undefined}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </div>
  );
}
