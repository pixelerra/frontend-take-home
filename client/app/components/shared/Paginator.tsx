import { Button } from "@radix-ui/themes";
import { Link } from "react-router";

import styles from "./Paginator.module.css";

type Props = {
  totalPages: number;
  prevPage: number;
  nextPage: number;
};

/**
 * Helper component to render pagniation forward/backward links.
 */
function PaginationControl({
  page,
  totalPages,
  direction,
}: {
  page: number;
  totalPages: number;
  direction: "prev" | "next";
}) {
  const isDisabled = page < 1 || page > totalPages;
  const label = direction === "prev" ? "Previous" : "Next";

  return (
    <Button asChild disabled={isDisabled}>
      {isDisabled ? (
        <span aria-disabled="true" aria-label={direction}>
          {label}
        </span>
      ) : (
        <Link to={`?page=${page}`} aria-label={direction} viewTransition>
          {label}
        </Link>
      )}
    </Button>
  );
}

/**
 * Paginator component for navigating through paginated results.
 */
export function Paginator({ totalPages, prevPage, nextPage }: Props) {
  return (
    <nav>
      <ul className={styles.pagination}>
        <li>
          <PaginationControl
            page={prevPage || 0}
            totalPages={totalPages}
            direction="prev"
          />
        </li>
        <li>
          <PaginationControl
            page={nextPage || 0}
            totalPages={totalPages}
            direction="next"
          />
        </li>
      </ul>
    </nav>
  );
}
