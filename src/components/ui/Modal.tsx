import { Button } from "./Button";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function Modal({ open, onClose, title, footer, children }: ModalProps) {
  if (!open) return null;

  function handleOverlayClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0f0f]/25 px-3 py-6"
      onClick={handleOverlayClick}
    >
      <div className="modal-pop relative w-full max-w-xl rounded-[10px] border-[2.5px] border-black bg-[#f8f5ef] p-5 text-neutral-900 shadow-[8px_8px_0px_rgba(0,0,0,0.7)]">
        <div className="absolute right-3 top-3 z-10">
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 rounded-[6px] p-0 text-2xl leading-none shadow-none hover:shadow-none focus-visible:ring-offset-[#f8f5ef]"
          >
            ×
          </Button>
        </div>

        {title && (
          <h2 className="font-mono pr-10 text-xl font-semibold tracking-tight text-neutral-900">
            {title}
          </h2>
        )}

        <div className="mt-3 text-sm leading-relaxed text-neutral-700">
          {children}
        </div>

        {footer && (
          <div className="mt-4 flex flex-wrap justify-end gap-3">{footer}</div>
        )}
      </div>
    </div>
  );
}
