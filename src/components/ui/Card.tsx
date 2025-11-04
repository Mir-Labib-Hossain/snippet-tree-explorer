type CardProps = {
  children: React.ReactNode;
  className?: React.ComponentProps<"div">["className"];
};

export function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-lg border border-[#C8DAE2] p-4 ${className}`}>
      {children}
    </div>
  );
}
