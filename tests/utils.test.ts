import { describe, expect, test } from "@jest/globals";

import { arrayOrNone, objectOrNone } from "../src/utils";

describe("objectOrNone", () => {
  test("object is detected", () => {
    const obj = { foo: "bar" };
    expect(objectOrNone(obj)).toBe(obj);
  });

  test("null returns null", () => {
    expect(objectOrNone(null)).toBe(null);
  });
});

describe("arrayOrNone", () => {
  test("array is detected", () => {
    const arr = ["foo", "bar"];
    expect(arrayOrNone(arr)).toBe(arr);
  });

  test("null returns null", () => {
    expect(arrayOrNone(null)).toBe(null);
  });
});
