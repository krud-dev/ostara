export const notEmpty = <TValue>(value: TValue | null | undefined): value is TValue => {
  return !(value === null || value === undefined);
};

export const typeCheck = <T>(arg: T): T => {
  return arg;
};
