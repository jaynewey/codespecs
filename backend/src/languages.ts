export const languages = ["JavaScript (Node.js 16.3.0)"] as const;

export type Language = typeof languages[number];
