export const objectOrNone = (obj: any): { [key: string]: any } | null => {
  return !!obj && obj.constructor === Object ? obj : null;
};

export const arrayOrNone = (obj: any): Array<any> | null => {
  return !!obj && obj.constructor === Array ? obj : null;
};
