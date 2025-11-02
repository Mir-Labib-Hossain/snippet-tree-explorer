import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export function Card({ children }: CardProps) {
  return <div className="overflow-hidden rounded-lg border border-[#C8DAE2] p-4">{children}</div>;
}
