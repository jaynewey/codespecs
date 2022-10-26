export type JSONObject = {
  [key: string]: JSONValue;
};

export type JSONValue =
  | Partial<{ [key: string]: JSONValue }>
  | JSONValue[]
  | string
  | number
  | boolean
  | null;
