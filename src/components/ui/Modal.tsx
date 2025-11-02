import type { MouseEvent, ReactNode } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
};

export function Modal({ open, onClose, title, footer, children }: ModalProps) {
  if (!open) {
    return null;
  }

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-label={title}>
      <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-3 top-3 text-xl leading-none text-gray-500 transition hover:text-gray-700">
          ×
        </button>

        {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}

        <div className="mt-4 text-sm text-gray-700">{children}</div>

        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
