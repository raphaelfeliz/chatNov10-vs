/* *file-summary*
PATH: src/helpers/GET_VALUE.ts

PURPOSE: Retrieves and returns the text value from an input element.

SUMMARY: Used to get value from userInputField.
*/

export default function GET_VALUE(element: HTMLInputElement | null): string {
  if (!element) return '';
  return element.value || '';
}
