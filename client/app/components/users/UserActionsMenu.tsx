import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenu, Button } from "@radix-ui/themes";
import { useRef, useState } from "react";

import { DeleteUserModal } from "./DeleteUserModal";

type Props = {
  userId: string;
  userName: string;
};

/**
 * UserActionsMenu component renders a dropdown menu with actions for a user.
 */
export function UserActionsMenu({ userId, userName }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="ghost" ari-label="User actions">
            <span className="sr-only">User actions</span>
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" sideOffset={5}>
          {/* Aussuming that editing users is an extension, since it's not in
              the checklist of features to implement in the README, so we disable it for now */}
          <DropdownMenu.Item disabled>Edit user</DropdownMenu.Item>
          <DropdownMenu.Item
            role="button"
            onClick={() => {
              // This is hacky but works to trigger the modal
              // I couldn't get Radix to open the modal directly without
              // including Dialog.Trigger in the modal component
              triggerRef.current?.click();
              setIsModalOpen(true);
            }}
          >
            Delete user
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <DeleteUserModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        userId={userId}
        userName={userName} // Replace with actual user name
        triggerRef={triggerRef} // Pass the ref to the modal
      />
    </>
  );
}
