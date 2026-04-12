"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="fixed inset-0 m-0 h-full w-full max-w-none max-h-none bg-transparent p-0 backdrop:bg-ink/50"
    >
      <div className="flex h-full items-end justify-center">
        <div
          className={`w-full max-w-[430px] rounded-t-[24px] bg-beige px-5 pb-8 transition-transform duration-250 ${open ? "animate-slideUp" : ""}`}
        >
          <div className="flex justify-center py-3">
            <div className="h-1 w-9 rounded-full bg-beige-dark" />
          </div>
          {title && (
            <h2 className="mb-4 text-[17px] font-semibold tracking-[-0.02em] text-ink">
              {title}
            </h2>
          )}
          {children}
        </div>
      </div>
    </dialog>
  );
}
