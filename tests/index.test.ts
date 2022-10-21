import { describe, expect, test } from "@jest/globals";

import { helloWorld } from "../src";

describe("hello world", () => {
  test("returns hello world", () => {
    expect(helloWorld()).toBe("Hello, world!");
  });
});
