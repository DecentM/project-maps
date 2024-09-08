import type { OverpassInterpreter } from "@project-maps/proto/overpass-interpreter";
import path from "node:path";
import { query } from "src/declarations/query";

export const create = query<ReturnType<typeof OverpassInterpreter.QueryInput['toObject']>>({
  path: path.resolve(import.meta.dirname, 'query.overpassql'),
});
