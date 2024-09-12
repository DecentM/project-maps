import path from "node:path";
import { query } from "src/declarations/query";

export type Params = {
  range: number;
  coordinates: { lng: number; lat: number };
  tags: string[];
};

export const create = query<Params>({
  path: path.resolve(import.meta.dirname, 'query.overpassql'),
});
