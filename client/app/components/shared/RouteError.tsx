import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router";

type Props = {
  error: Error;
};

/**
 * RouteError component to display when a route fails to load.
 * This component is used in an error boundary at the route level
 */
export function RouteError({ error }: Props) {
  // Use the useNavigate hook from react-router to provide a way to reload the page
  const navigate = useNavigate();

  return (
    <Flex direction="column" align="center" justify="center" gap="4" py="8">
      <Heading size="4" color="red">
        Oh no! Something went wrong.
      </Heading>
      <Text size="3" color="red">
        We encountered an error while trying to load this page.
      </Text>
      <Text color="gray">
        Error:{" "}
        {error.message || "We couldn’t load this view. Please try again."}
      </Text>
      <Button onClick={() => navigate(0)}>Reload Page</Button>
    </Flex>
  );
}
