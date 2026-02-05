import { describe, it } from "node:test";
import { paralysis } from "./paralysis.js";
import { faker } from "@faker-js/faker";
import assert from "node:assert";
import { setTimeout } from "node:timers/promises";

describe("paralysis", () => {
  it("should handle a concurrency of 4", async () => {
    const input = Array.from({ length: 100 }).fill(0);
    const concurrency = 4;
    let running = 0;

    async function runDelayed() {
      running++;
      assert(running <= concurrency);
      await setTimeout(faker.number.int(30, 200));
      running--;
    }

    await paralysis(input, runDelayed, concurrency);
  });

  it("should execute fn for every item in list", async () => {
    const ids = [1, 2, 3, 4, 5];

    function getUser(id) {
      return Promise.resolve({
        id,
        username: faker.internet.username(),
        birthdate: faker.date.birthdate(),
      });
    }

    const users = await paralysis(ids, getUser);
    users.forEach((user) => {
      assert(ids.includes(user.id));
      assert.equal(typeof user.username, "string");
      assert(user.birthdate instanceof Date);
    });
  });

  it("should throw with an invalid concurrency", async () => {
    const input = [100, 200, 10, 36, 13, 45];

    function double(x) {
      return Promise.resolve(x * 2);
    }

    await assert.rejects(async () => paralysis(input, double, NaN), {
      name: "TypeError",
      message: "Expected `concurrency` to be a number from 1 and up",
    });
  });
});
