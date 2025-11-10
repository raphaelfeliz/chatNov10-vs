/* *file-summary*
PATH: src/helpers/TO_STRING.ts

PURPOSE: Converts any data into a compact string form for debug logging.

SUMMARY: Safe stringify helper that falls back to primitive conversion when JSON fails.

FLOW: Used by debugLog and other logging utilities.

IMPORTS:
- (none)

EXPORTS:
- ./TO_STRING.ts // default export: TO_STRING(value)
*/

export default function TO_STRING(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  
  try {
    return JSON.stringify(value, null, 0);
  } catch (error) {
    return String(value);
  }
}
