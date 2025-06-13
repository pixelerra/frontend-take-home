import { Flex, Table, Text } from "@radix-ui/themes";

import { Paginator } from "../shared/Paginator";
import { RoleActionsMenu } from "./RoleActionsMenu";

import type { Role } from "~/types";
import { formatDisplayDate } from "~/utils/dates";

type Props = {
  roles: Role[];
  pagination: {
    pages?: number;
    prev?: number;
    next?: number;
  };
};

/**
 * Component renders a table of roles with pagination and actions.
 */
export function RoleTable({ roles, pagination }: Props) {
  const showFooter = pagination.pages && pagination.pages > 1;

  const renderEmptyState = () => (
    <Table.Row>
      <Table.Cell colSpan={5} className="text-center">
        <Flex align="center" justify="center">
          <Text size="4">No users found.</Text>
        </Flex>
      </Table.Cell>
    </Table.Row>
  );

  const renderUserRows = () => (
    <>
      {roles.map((role) => (
        <Table.Row key={role.id}>
          <Table.Cell>{role.name}</Table.Cell>
          <Table.Cell>
            {role.description || "No description provided"}
          </Table.Cell>
          <Table.Cell>{formatDisplayDate(role.createdAt)}</Table.Cell>
          <Table.Cell>
            <RoleActionsMenu role={role} />
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );

  return (
    <Table.Root variant="surface" className="user-table">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Role Name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Description</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <span className="sr-only">Actions</span>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {roles.length === 0 ? renderEmptyState() : renderUserRows()}
      </Table.Body>

      <tfoot>
        <Table.Row>
          <td colSpan={5} className="text-center">
            {showFooter ? (
              <Paginator
                totalPages={pagination?.pages || 1}
                prevPage={pagination?.prev || 0}
                nextPage={pagination?.next || 0}
              />
            ) : null}
          </td>
        </Table.Row>
      </tfoot>
    </Table.Root>
  );
}
