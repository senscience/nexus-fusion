/**
 * Nexus Delta nests all `_`-prefixed system metadata (`_project`, `_rev`, `_deprecated`, `_createdAt`, `_self`, ...)
 * under a single `_nexus` umbrella object inside Elasticsearch documents (to stay compatible with Elasticsearch
 * Serverless, which reserves some `_`-prefixed fields at the root).
 *
 * This ONLY applies to raw Elasticsearch access (query DSL sent to a view's `_search`, and reading `hit._source`).
 * The Delta REST listing (`nexus.Resource.list`) still uses the flat, logical field names and flattens `_nexus.*`
 * back to the root in its responses, so REST sorts/reads must NOT be prefixed.
 */
export const NEXUS_METADATA_PREFIX = '_nexus';

/**
 * Elasticsearch field path for a `_`-prefixed system metadata field.
 * e.g. `metaField('_deprecated')` -> `'_nexus._deprecated'`.
 */
export const metaField = (field: string): string =>
  `${NEXUS_METADATA_PREFIX}.${field}`;

/**
 * Read a system metadata field from an Elasticsearch `_source` object, where the metadata is nested under
 * {@link NEXUS_METADATA_PREFIX}. Returns `undefined` when absent.
 */
export const readMetaFromSource = (source: any, field: string): any =>
  source?.[NEXUS_METADATA_PREFIX]?.[field];

/**
 * Hoist the nested `_nexus` metadata object of an Elasticsearch `_source` back to the root, so downstream code
 * (table columns, `_source._self`, ...) can keep reading the flat, logical field names. Mirrors what the Delta
 * REST listing does. A no-op when there is no `_nexus` object (e.g. custom views that do not nest metadata).
 */
export const flattenNexusSource = <T extends Record<string, any>>(
  source: T
): T => {
  const nested = source?.[NEXUS_METADATA_PREFIX];
  if (!nested || typeof nested !== 'object') {
    return source;
  }
  const rest = { ...source };
  delete (rest as Record<string, any>)[NEXUS_METADATA_PREFIX];
  return { ...rest, ...nested } as T;
};
