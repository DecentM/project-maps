import fs from 'node:fs';

type Query = {
  path: string,
}

export const query = <Params extends Record<string, unknown>>(query: Query) => {
  const file = fs.readFileSync(query.path, 'utf-8');
  const contents = file.toString();

  return (input: Params) => {
    let interpolatedQuery = contents;

    for (const key in input) {
      interpolatedQuery = interpolatedQuery.replace(new RegExp(`{{${key}}`, 'g'), String(input[key]));
    }

    return interpolatedQuery;
  }
}
