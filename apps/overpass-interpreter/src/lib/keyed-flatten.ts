type Flatten<T, Prefix extends string = ''> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? T[K] extends Array<unknown>
      ? { [P in `${Prefix}${K}`]: T[K] } // If it's an array, keep it as is
      : Flatten<T[K], `${Prefix}${K}.`> // Recursively flatten objects
    : { [P in `${Prefix}${K}`]: T[K] }; // Otherwise, set the value
}[keyof T & (string | number)];

// Helper type to convert Flatten type into a single level object type
type FlattenedObject<T> = {
  [K in keyof Flatten<T>]: Flatten<T>[K];
};

export const flattenObject = <Input extends object>(obj: Input, parentKey = ''): FlattenedObject<Input> => {
  const result: Record<string, string | number | object | unknown> = {};

  for (const key in obj) {
    // biome-ignore lint/suspicious/noPrototypeBuiltins: Self contained function
    if (obj.hasOwnProperty(key)) {
      const newKey = parentKey ? `${parentKey}.${key}` : key;

      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        // Recursively flatten the nested object
        Object.assign(result, flattenObject(obj[key], newKey));
      } else if (Array.isArray(obj[key]) && obj[key].every((item) => typeof item === 'string')) {
        // If the value is an array of strings, join them with a comma
        result[newKey] = obj[key].map(item => `'${item}'`).join(',');
      } else {
        // Assign the value to the new key
        result[newKey] = obj[key];
      }
    }
  }

  return result as FlattenedObject<Input>
}
