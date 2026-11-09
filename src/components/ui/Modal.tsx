import type { ReactNode } from 'react';
import { useRef } from 'react';
import { X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';

export function Modal({
  close,
  title,
  children,
  wide = false,
  photo = false,
}: {
  close: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
  photo?: boolean;
}) {
  const opener = useRef(document.activeElement as HTMLElement | null);
  return (
    <Dialog.Root
      open
      onOpenChange={(open) => {
        if (!open) close();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className={`modal-backdrop${photo ? ' photo-overlay' : ''}`} />
        <Dialog.Content
          className={`modal${wide ? ' wide' : ''}${photo ? ' photo-modal' : ''}`}
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
        >
          <div className="modal-header">
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Close className="icon-button" aria-label="Close dialog">
              <X size={20} />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
