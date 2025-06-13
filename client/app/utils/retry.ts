/**
 * Helper function to retry an asynchronous operation with exponential backoff.
 * I'm using this to handle transient errors from the API and ensure
 * that the application can recover from temporary issues.
 *
 * @param fn - callback function that runs the operation to retry
 * @param attempts - the number of attempts to retry the operation
 * @param baseDelay - the base delay in milliseconds between retries, which will be exponentially increased
 * @returns
 */
export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  baseDelay: number = 100
): Promise<T> {
  let lastError: unknown;

  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const delay = baseDelay * 2 ** i;
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw lastError;
}
