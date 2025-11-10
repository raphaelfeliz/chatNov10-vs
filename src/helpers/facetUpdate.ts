/* *file-summary*
PATH: src/helpers/facetUpdate.ts

PURPOSE: Applies facet updates to the global facets object.

SUMMARY: Only overwrites non-null data.
*/

export interface Facets {
  [key: string]: any;
}

// Global facets object - will be imported and mutated
export const facets: Facets = {};

export default function facetUpdate(update: Partial<Facets>): void {
  for (const key in update) {
    if (update[key] !== null && update[key] !== undefined) {
      facets[key] = update[key];
    }
  }
}
