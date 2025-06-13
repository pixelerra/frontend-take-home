import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { DropdownMenu, Button } from "@radix-ui/themes";
import { useRef, useState } from "react";

import type { Role } from "~/types";
import { EditRoleModal } from "./EditRoleModal";

type Props = {
  role: Role;
};

/**
 * Component renders a dropdown menu with actions for a role.
 *
 */
export function RoleActionsMenu({ role }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="ghost" ari-label="User actions">
            <span className="sr-only">Role actions</span>
            <DotsHorizontalIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" sideOffset={5}>
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
            Edit role
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <EditRoleModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        triggerRef={triggerRef}
        role={role}
      />
    </>
  );
}
