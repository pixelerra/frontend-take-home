import { Button, Dialog, TextArea, TextField } from "@radix-ui/themes";

import { Form } from "radix-ui";
import type { Role } from "~/types";
import { useState } from "react";
import { useRevalidator } from "react-router";

import styles from "./EditRoleModal.module.css";

type EditFormProps = {
  roleName: string;
  roleDescription: string;
  setRoleName: React.Dispatch<React.SetStateAction<string>>;
  setRoleDescription: React.Dispatch<React.SetStateAction<string>>;
  fieldErrors: {
    roleName: string;
    roleDescription: string;
  };
  setErrors: React.Dispatch<
    React.SetStateAction<{
      roleName: string;
      roleDescription: string;
    }>
  >;
};

/**
 * Form component for editing a role.
 *
 */
function EditRoleForm({
  roleName,
  setRoleName,
  roleDescription,
  setRoleDescription,
  fieldErrors,
  setErrors,
}: EditFormProps) {
  // This is some very basic input validation,
  // In a real application, I'd opt for something like Zod to define
  // a schema for the form and validate it on submit and blur events.
  const onNameBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (value.length === 0) {
      setErrors((prev) => ({
        roleName: "Role name cannot be empty.",
        roleDescription: prev.roleDescription,
      }));
    }
  };

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoleName(value);
    setErrors((prev) => ({
      roleName: "",
      roleDescription: prev.roleDescription,
    }));
  };
  return (
    <Form.Root>
      <Form.Field name="roleName" className={styles.field}>
        <Form.Label>Role name</Form.Label>
        <Form.Control asChild>
          <TextField.Root
            className={styles.input}
            type="text"
            placeholder="Enter role name"
            value={roleName}
            onBlur={onNameBlur}
            onChange={onNameChange}
          />
        </Form.Control>
        {fieldErrors.roleName && (
          <Form.Message className={styles.error}>
            {fieldErrors.roleName}
          </Form.Message>
        )}
      </Form.Field>
      <Form.Field name="roleDescription" className={styles.field}>
        <Form.Label>Description</Form.Label>
        <Form.Control asChild>
          <TextArea
            className={styles.input}
            placeholder="Enter role description"
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
          />
        </Form.Control>
        {fieldErrors.roleDescription && (
          <Form.Message className={styles.error}>
            {fieldErrors.roleDescription}
          </Form.Message>
        )}
      </Form.Field>
    </Form.Root>
  );
}

type ModalProps = {
  isOpen: boolean;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
  onOpenChange: (open: boolean) => void;
  role: Role;
};

/**
 * EditRoleModal component for editing a role
 */
export function EditRoleModal({
  isOpen,
  onOpenChange,
  triggerRef,
  role,
}: ModalProps) {
  const { revalidate } = useRevalidator();
  const [isSaving, setIsSaving] = useState(false);
  const [roleName, setRoleName] = useState(role.name);
  const [roleDescription, setRoleDescription] = useState(
    role.description || ""
  );
  const [fieldErrors, setFieldErrors] = useState({
    roleName: "",
    roleDescription: "",
  });

  // This is not optimistically updating the UI, but rather waiting for the revalidation
  // to complete before closing the modal. This ensures that the role list is updated
  // and we don't need to manually manage the state of the role list if a call fails.
  // The trade-off here is that user will need to wait for the revalidation
  // to complete before the modal closes. This is a simpler approach that avoids
  // potential inconsistencies in the UI given the constraints of the Take Home project.
  // If I had more time or this was a production application, I would consider optimistic UI updates
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      await fetch(`/api/roles/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roleId: role.id,
          roleName: roleName.trim(),
          roleDescription: roleDescription.trim(),
        }),
      });

      // Revalidate the roles list to reflect the changes
      await revalidate();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to save role changes:", error);
      // Basic error handling
      setFieldErrors({
        roleName: "Failed to save role name. Please try again.",
        roleDescription: "Failed to save role description. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger ref={triggerRef}>
        <Button className="sr-only" variant="ghost">
          Edit Role
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Edit role</Dialog.Title>
        <Dialog.Description className={styles.description}>
          Edit the details of the role <b>{role.name}</b>.
        </Dialog.Description>
        <EditRoleForm
          roleName={roleName}
          setRoleName={setRoleName}
          roleDescription={roleDescription}
          setRoleDescription={setRoleDescription}
          fieldErrors={fieldErrors}
          setErrors={setFieldErrors}
        />
        <div className={styles.actions}>
          <Dialog.Close>
            <Button variant="outline">Cancel</Button>
          </Dialog.Close>
          <Button
            onClick={() => handleSaveChanges()}
            loading={isSaving}
            disabled={isSaving || !roleName.trim()}
          >
            Save Changes
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
