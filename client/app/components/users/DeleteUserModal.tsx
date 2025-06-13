import { useState } from "react";
import { ConfirmModal } from "../shared/ConfirmModal";
import { useRevalidator } from "react-router";
import { Button } from "@radix-ui/themes";

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userId: string;
  userName: string;
  onDelete?: (userId: string) => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
};

/**
 * DeleteUserModal component for confirming user deletion.
 */
export function DeleteUserModal({
  isOpen,
  setIsOpen,
  userId,
  userName,
  triggerRef,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { revalidate } = useRevalidator();

  // This is not optimistically updating the UI, but rather waiting for the revalidation
  // to complete before closing the modal. This ensures that the user list is updated
  // and we don't need to manually manage the state of the user list if a call fails.
  // The trade-off here is that user will need to wait for the revalidation
  // to complete before the modal closes, but this is a simpler approach that avoids
  // potential inconsistencies in the UI given the constraints of the Take Home project.
  // If I had more time or this was a production application, I would consider optimistic UI updates
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await fetch(`/api/users/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userId }),
      });

      // Revalidate the user list to reflect the deletion
      // We'll await for revalidation to complete before closing the modal
      // This ensures that the content below the modal is update before the modal closes
      await revalidate();
      setIsOpen(false);
    } catch (error) {
      setError("Failed to delete user. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ConfirmModal
      triggerRef={triggerRef}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Delete User"
      triggerLabel="Delete User"
      description={() => (
        <>
          <span>
            Are you sure? The user <b>{userName}</b> will be deleted
            permanently.
          </span>
          {error && <span>{error}</span>}
        </>
      )}
      renderConfirmButton={() => (
        <Button
          variant="soft"
          color="red"
          onClick={() => handleDelete()}
          loading={isDeleting}
        >
          Delete
        </Button>
      )}
    />
  );
}
