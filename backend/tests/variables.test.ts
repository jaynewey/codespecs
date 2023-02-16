import { guessType } from "../src/dap/tracer/variables";

describe("guessType", () => {
  test("array with just indexes", () => {
    const variable = {
      name: "foo",
      value: "[1, 2, 3]",
      variablesReference: 0,
    };
    const indexes = [
      {
        id: 0,
        likeType: "numeric",
        nativeType: "int",
        name: "0",
        value: "1",
      },
      {
        id: 1,
        likeType: "numeric",
        nativeType: "int",
        name: "1",
        value: "2",
      },
      {
        id: 2,
        likeType: "numeric",
        nativeType: "int",
        name: "2",
        value: "3",
      },
    ];
    expect(guessType(variable, [], indexes)).toBe("array");
  });

  test("array with indexes and attributes", () => {
    const variable = {
      name: "foo",
      value: "[1, 2, 3]",
      variablesReference: 0,
    };
    const indexes = [
      {
        id: 0,
        likeType: "numeric",
        nativeType: "int",
        name: "0",
        value: "1",
      },
      {
        id: 1,
        likeType: "numeric",
        nativeType: "int",
        name: "1",
        value: "2",
      },
      {
        id: 2,
        likeType: "numeric",
        nativeType: "int",
        name: "2",
        value: "3",
      },
    ];
    const attributes = [
      {
        id: 3,
        likeType: "numeric",
        nativeType: "int",
        name: "length",
        value: "3",
      },
    ];
    expect(guessType(variable, attributes, indexes)).toBe("array");
  });

  test("object", () => {
    const variable = {
      name: "foo",
      value: "{a: 'b'}",
      variablesReference: 0,
    };
    const attributes = [
      {
        id: 0,
        likeType: "string",
        nativeType: "string",
        name: "a",
        value: "'b'",
      },
    ];
    expect(guessType(variable, attributes, [])).toBe("object");
  });

  test("single quote string", () => {
    const variable = {
      name: "foo",
      value: "'foo'",
      variablesReference: 0,
    };
    expect(guessType(variable, [], [])).toBe("string");
  });

  test("double quote string", () => {
    const variable = {
      name: "foo",
      value: '"foo"',
      variablesReference: 0,
    };
    expect(guessType(variable, [], [])).toBe("string");
  });

  test("actual number", () => {
    const variable = {
      name: "foo",
      value: "42",
      variablesReference: 0,
    };
    expect(guessType(variable, [], [])).toBe("numeric");
  });

  test("Not categorised returns number", () => {
    const variable = {
      name: "foo",
      value: "foo",
      variablesReference: 0,
    };
    expect(guessType(variable, [], [])).toBe("numeric");
  });
});
