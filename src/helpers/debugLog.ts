/* *file-summary*
PATH: src/helpers/debugLog.ts

PURPOSE: Centralized debug logger for structured step-by-step tracing.

SUMMARY: Prints a structured debug line containing a step name and a stringified value.

FLOW: Helper used across nodes and components for structured logging during development.

IMPORTS:
- ./TO_STRING.ts // utility to stringify values for logs

EXPORTS:
- ./debugLog.ts // default export: debugLog(step, value)
*/

import TO_STRING from './TO_STRING';

export default function debugLog(step: string, value: any): void {
  console.log(`[DEBUG] ${step} | value: ${TO_STRING(value)}`);
}
