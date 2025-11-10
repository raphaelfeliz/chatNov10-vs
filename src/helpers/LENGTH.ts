/* *file-summary*
PATH: src/helpers/LENGTH.ts

PURPOSE: Returns the number of items in a list, array, or map.

SUMMARY: Used for logging message database size.
*/

export default function LENGTH(collection: any[] | Map<any, any> | Set<any> | object): number {
  if (Array.isArray(collection)) {
    return collection.length;
  }
  
  if (collection instanceof Map || collection instanceof Set) {
    return collection.size;
  }
  
  if (typeof collection === 'object' && collection !== null) {
    return Object.keys(collection).length;
  }
  
  return 0;
}
