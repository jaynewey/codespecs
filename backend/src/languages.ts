export const languages = [
  "Python (3.9.4)",
  "Python (2.7.17)",
  "JavaScript (Node.js 16.3.0)",
  "Java (OpenJDK 13.0.1)",
] as const;

export type Language = typeof languages[number];
