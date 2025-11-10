/* *file-summary*
PATH: src/helpers/nowId.ts

PURPOSE: Generates a unique message ID and timestamp.

SUMMARY: Returns an object with `id` and `timestamp` based on CURRENT_TIMESTAMP().

FLOW: Used by buildMessage and other message-creation helpers.

IMPORTS:
- ./CURRENT_TIMESTAMP.ts // provides a consistent timestamp value

EXPORTS:
- ./nowId.ts // default export: nowId()
*/

import CURRENT_TIMESTAMP from './CURRENT_TIMESTAMP';

export default function nowId(): { id: string; timestamp: number } {
  const timestamp = CURRENT_TIMESTAMP();
  const id = `msg_${timestamp}`;
  
  return { id, timestamp };
}
