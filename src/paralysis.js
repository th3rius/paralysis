import TinyQueue from "tinyqueue";

function createRun(concurrency) {
  const queue = new TinyQueue();
  let slots = Math.floor(concurrency);

  function release() {
    // Check if we have more functions waiting in the queue. If we
    // do, run the next delayed function. Otherwise, free a slot.
    const next = queue.pop();
    if (next) {
      const [resolve, delayed] = next;
      resolve(delayed);
    } else {
      slots++;
    }
  }

  function runRecipe([fn, args]) {
    // Note that if `fn` throws a synchronous error inside
    // `new Promise()` it will reject the promise. This
    // wouldn't happen if we used `Promise.resolve()` directly.
    return new Promise((resolve) => {
      resolve(fn(...args));
    }).finally(release);
  }

  return function run(recipe) {
    // If we have an available slot, take the slot and return
    // a promise that executes the function immediately.
    if (slots > 0) {
      slots--;
      return runRecipe(recipe);
    }

    // If the limit of slots is reached, enqueue the function
    // and return a promise that will be resolved only after
    // the next slot is released and the function is executed.
    return new Promise((resolve) => {
      queue.push([resolve, recipe]);
    }).then(runRecipe);
  };
}

export function paralysis(list, fn, concurrency = Infinity) {
  if (typeof fn !== "function") {
    throw new TypeError(`${fn} is not a function`);
  }

  if (!(typeof concurrency === "number" && concurrency >= 1)) {
    throw new TypeError("Expected `concurrency` to be a number from 1 and up");
  }

  const run = createRun(concurrency);
  return Promise.all(Array.from(list, (...args) => run([fn, args])));
}
