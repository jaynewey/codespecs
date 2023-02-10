export const languages = [
  "JavaScript (Node.js 16.3.0)",
  "Python (3.9.4)",
] as const;

export type Language = (typeof languages)[number];
