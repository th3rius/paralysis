type Promisable<T> = T | PromiseLike<T>;

/**
 * Maps the async function `fn` over each element of
 * `list`, limited by `concurrency` executions in parallel.
 * Returns a promise that resolves with all the results.
 *
 * @example
 * ```js
 * import parallel from "paralysis";
 *
 * async function getUser(id) {
 *   const response = await fetch(
 *     `https://jsonplaceholder.typicode.com/users/${id}`,
 *   );
 *   const user = await response.json();
 *   return user;
 * }
 *
 * const users = await parallel([1, 2, 3, 4, 5], getUser, 2);
 * ```
 *
 * @param list List that is iterated over concurrently, calling `fn` for each item.
 * @param fn Async function that is called for every item of `list`.
 * @param concurrency Number of concurrently pending promises returned by `fn`.
 * @returns A new promise.
 */
export default function paralysis<T, U>(
  list: ArrayLike<T>,
  fn: (element: T, index: number) => Promisable<U>,
  concurrency?: number,
): Promise<Array<U>>;
