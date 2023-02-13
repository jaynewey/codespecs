export const languages = [
  "JavaScript (Node.js 16.3.0)",
  "Python (3.10.0)",
  "C++ (GCC 10.2.0)",
] as const;

export type Language = (typeof languages)[number];
