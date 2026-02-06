# Paralysis

Maps over promises concurrently.

```js
import parallel from "paralysis";

const ids = [1, 2, 3, 4, 5];
const concurrency = 2;

async function getUser(id) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/users/${id}`,
  );
  const user = await response.json();
  return user;
}

const users = await parallel(ids, getUser, concurrency);
```

This is similar to
[`Promise.all()`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Promise/all),
but accepts an optional concurrency limit.
