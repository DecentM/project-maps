// Helper type to generate combinations in a consistent order
type OrderedCombinations<
  T extends string[],
  Prefix extends string = '',
  Remaining extends string[] = T
> = Remaining extends [infer First extends string, ...infer Rest extends string[]]
    ? // Recur with and without the current element, maintaining order
      | `${Prefix}${Prefix extends '' ? '' : ','}${First}` // Add the current element to the prefix
      | OrderedCombinations<T, `${Prefix}${Prefix extends '' ? '' : ','}${First}`, Rest> // Recur including the element
      | OrderedCombinations<T, Prefix, Rest> // Recur without including the current element
    : never;

// Remove the initial empty string (if generated)
type FilterEmpty<T> = T extends '' ? never : T;

export type StringArrayCombinations<T extends string[]> = FilterEmpty<OrderedCombinations<T>>;
