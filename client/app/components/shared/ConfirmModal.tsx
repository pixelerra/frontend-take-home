import { Button, Dialog } from "@radix-ui/themes";

import styles from "./ConfirmModal.module.css";

type Props = {
  isOpen: boolean;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  onOpenChange?: (open: boolean) => void;
  title: string;
  triggerLabel?: string;
  description: () => React.ReactNode;
  renderConfirmButton: () => React.ReactNode;
};

/**
 * ConfirmModal component for displaying a confirmation dialog.
 */
export function ConfirmModal({
  isOpen,
  onOpenChange,
  triggerRef,
  title,
  triggerLabel = "Open Modal",
  description,
  renderConfirmButton,
}: Props) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger ref={triggerRef}>
        <Button className="sr-only" variant="ghost">
          {triggerLabel}
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{description()}</Dialog.Description>
        <div className={styles.actions}>
          <Dialog.Close>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          {renderConfirmButton()}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
