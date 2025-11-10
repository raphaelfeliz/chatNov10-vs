/* *file-summary*
PATH: src/helpers/CLEAR.ts

PURPOSE: Clears or resets the provided input element's value.

SUMMARY: Used in newMessageListener after message send.
*/

export default function CLEAR(element: HTMLInputElement | null): void {
  if (element) {
    element.value = '';
  }
}
