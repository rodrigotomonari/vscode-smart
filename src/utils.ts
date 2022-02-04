export function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

export function compareBy<T, K extends keyof T>(key: K) {
  return function (a: T, b: T) {
    return a[key] > b[key] ? 1 : -1;
  };
}
