/* *file-summary*
PATH: src/helpers/CURRENT_TIMESTAMP.ts

PURPOSE: Returns the current timestamp in a consistent format (ms since epoch).

SUMMARY: Simple wrapper around Date.now() to centralize time formatting if needed later.

FLOW: Used by nowId to derive message IDs and timestamps.

IMPORTS:
- (none)

EXPORTS:
- ./CURRENT_TIMESTAMP.ts // default export: CURRENT_TIMESTAMP()
*/

export default function CURRENT_TIMESTAMP(): number {
  return Date.now();
}
