"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const src_1 = require("../src");
(0, globals_1.describe)("hello world", () => {
    (0, globals_1.test)("returns hello world", () => {
        (0, globals_1.expect)((0, src_1.helloWorld)()).toBe("Hello, world!");
    });
});
