import { Avatar, Flex, Table, Text } from "@radix-ui/themes";
import type { UserWithRole } from "~/types";
import { Paginator } from "../shared/Paginator";

import { formatDisplayDate } from "~/utils/dates";
import { UserActionsMenu } from "./UserActionsMenu";

type Props = {
  users: UserWithRole[];
  pagination: {
    pages?: number;
    prev?: number;
    next?: number;
  };
};

/**
 * Renders the user table with pagination and actions.
 */
export function UserTable({ users, pagination }: Props) {
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
      {users.map((user) => (
        <Table.Row key={user.id}>
          <Table.Cell>
            <Avatar
              src={user.photo}
              alt={`${user.first} ${user.last}`}
              width="50"
              height="50"
              radius="full"
              fallback={`${user.first.charAt(0)}${user.last.charAt(0)}}`}
            />
          </Table.Cell>
          <Table.Cell>
            {user.first} {user.last}
          </Table.Cell>

          <Table.Cell>
            {user.role ? user.role.name : "No role assigned"}
          </Table.Cell>
          <Table.Cell>{formatDisplayDate(user.createdAt)}</Table.Cell>
          <Table.Cell>
            <UserActionsMenu
              userId={user.id}
              userName={`${user.first} ${user.last}`}
            />
          </Table.Cell>
        </Table.Row>
      ))}
    </>
  );

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>
            <span className="sr-only">Avatar</span>
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Role</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Joined</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>
            <span className="sr-only">Actions</span>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {users.length > 0 ? renderUserRows() : renderEmptyState()}
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
