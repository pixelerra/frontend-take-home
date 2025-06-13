import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { TextField } from "@radix-ui/themes";

import styles from "./EntitySearch.module.css";

type Props = {
  id: string;
  name: string;
  placeholder: string;
  label: string;
  ariaLabel?: string;
  action: string;
  searchTerm: string | null;
  handleSearch: (searchTerm: string) => void;
  className?: string;
};

/**
 * Helper function to debounce a function call.
 *
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds to wait before invoking the function
 * @returns
 */
function debounce(func: Function, delay = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (...args: unknown[]) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * EntitySearch component for searching entities like users or roles.
 *
 * @returns
 */
export function EntitySearch({
  id,
  name,
  placeholder,
  label,
  action,
  handleSearch,
  searchTerm,
  className,
}: Props) {
  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const searchInput = event.currentTarget.elements.namedItem(
      "search"
    ) as HTMLInputElement;
    const searchValue = searchInput.value.trim();

    handleSearch(searchValue);
  }

  return (
    <form
      method="get"
      action={action}
      className={styles.searchContainer + (className ? ` ${className}` : "")}
      onSubmit={debounce(handleSubmit, 300)}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <TextField.Root
        id={id}
        type="search"
        name={name}
        placeholder={placeholder}
        defaultValue={searchTerm || ""}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      >
        <TextField.Slot>
          <MagnifyingGlassIcon />
        </TextField.Slot>
      </TextField.Root>
    </form>
  );
}
