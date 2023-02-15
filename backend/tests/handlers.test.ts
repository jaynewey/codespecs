import { describe, expect, test } from "@jest/globals";

import { flushLines } from "../src/dap/tracer/handlers";
import { Line, ProgramTrace } from "../src/dap/tracer/types";

describe("flushLines", () => {
  test("empty remains empty", () => {
    const programTrace: ProgramTrace = {
      language: "Python (3.10.0)",
      lines: [],
    };
    const lines: Line[] = [];
    flushLines(lines, programTrace);
    expect(lines).toEqual([]);
  });

  test("programTrace unchanged", () => {
    const origProgramTrace: ProgramTrace = {
      language: "Python (3.10.0)",
      lines: [],
    };
    const programTrace: ProgramTrace = {
      language: "Python (3.10.0)",
      lines: [],
    };
    flushLines([], programTrace);
    expect(programTrace).toEqual(origProgramTrace);
  });

  test("empty does not add to populated", () => {
    const origProgramTrace: ProgramTrace = {
      language: "Python (3.10.0)",
      lines: [{ lineNumber: 1, variables: [] }],
    };
    const programTrace: ProgramTrace = {
      language: "Python (3.10.0)",
      lines: [{ lineNumber: 1, variables: [] }],
    };
    flushLines([], programTrace);
    expect(programTrace).toEqual(origProgramTrace);
  });

  test("can populate empty", () => {
    const expectedProgramTrace: ProgramTrace = {
      language: "Python (3.10.0)",
      lines: [{ lineNumber: 1, variables: [] }],
    };
    const programTrace: ProgramTrace = {
      language: "Python (3.10.0)",
      lines: [],
    };
    const lines: Line[] = [{ lineNumber: 1, variables: [] }];
    flushLines(lines, programTrace);
    expect(programTrace).toEqual(expectedProgramTrace);
  });

  test("can populate populated", () => {
    const expectedProgramTrace: ProgramTrace = {
      language: "Python (3.10.0)",
      lines: [
        { lineNumber: 1, variables: [] },
        { lineNumber: 2, variables: [] },
      ],
    };
    const programTrace: ProgramTrace = {
      language: "Python (3.10.0)",
      lines: [{ lineNumber: 1, variables: [] }],
    };
    const lines: Line[] = [{ lineNumber: 2, variables: [] }];
    flushLines(lines, programTrace);
    expect(programTrace).toEqual(expectedProgramTrace);
  });
});
