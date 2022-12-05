export const languages = [
  "Python (3.8.1)",
  "Python (2.7.17)",
  "JavaScript (Node.js 12.14.0)",
  "Java (OpenJDK 13.0.1)",
] as const;

export type Language = typeof languages[number];
