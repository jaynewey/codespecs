export const languages = [
  "JavaScript (Node.js 16.3.0)",
  "TypeScript (Node.js 16.3.0)",
  "Python (3.10.0)",
  "C (GCC 8.3.0)",
  "C++ (GCC 8.3.0)",
  "Rust (rustc 1.65.0)",
] as const;

export type Language = (typeof languages)[number];
