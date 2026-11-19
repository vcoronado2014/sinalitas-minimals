
export const isSomeTrue = (...values: any) => (
  values.some((value: any) => Boolean(value))
);

export const isEqual = (val1: any, val2: any) => val1 === val2;
