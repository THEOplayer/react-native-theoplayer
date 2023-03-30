export function arrayRemoveElement<T>(array: T[], element: T): boolean {
  const index = array.indexOf(element);
  if (index === -1) {
    return false;
  }
  arrayRemoveAt(array, index);
  return true;
}

export function arrayRemoveAt<T>(array: T[], index: number): void {
  array.splice(index, 1);
}
