export function fieldToNumber(obj: Record<string, any>) {
  const response: any = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string' && !isNaN(Number(value))) {
      response[key] = Number(value);
    } else {
      response[key] = value;
    }
  });

  return response;
}

export function randomNumberField(obj: Record<string, any>) {
  // Number fields to update
  let count = 10;
  const response: any = {};
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'number' && count > 0) {
      response[key] = Math.random() * 100;
    } else {
      response[key] = value;
    }
    count--;
  });

  return response;
}

export function randomNumberForPositions(obj: Record<string, any>) {
  return {
    ...obj,
    positions: (obj.positions || []).map(
      pipe(fieldToNumber, randomNumberField),
    ),
  };
}

export function pipe<T extends any[], R>(
  fn1: (...args: T) => R,
  ...fns: Array<(a: R) => R>
) {
  const piped = fns.reduce(
    (prevFn, nextFn) => (value: R) => nextFn(prevFn(value)),
    (value) => value,
  );
  return (...args: T) => piped(fn1(...args));
}

export type FunctionArguments<T extends Function> = T extends (
  ...args: infer R
) => any
  ? R
  : never;
