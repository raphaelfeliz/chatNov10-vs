/* *file-summary*
PATH: src/core/ui/uiQuestionNode.ts

PURPOSE: Prepares and structures the question UI based on the current filter state.

SUMMARY: Builds display-ready question text with options list formatted as markdown-style text.

FLOW: Used by aiPrompter to format the bot's question message.

IMPORTS:
- ../../helpers/debugLog.ts // structured logging

EXPORTS:
- ./uiQuestionNode.ts // exports: buildQuestionState
*/

import debugLog from '../../helpers/debugLog';
import type { Option } from '../engine/filterUtils';

export type FilterState = {
  currentQuestion: string | null;
  currentOptions: Option[];
  questionText: string;
};

export function buildQuestionState(filterState: FilterState): string {
  debugLog('[START] buildQuestionState', filterState.currentQuestion);
  
  const { questionText } = filterState;
  
  // Return just the question text without options
  // Options will be rendered separately in cell 1 (configurator)
  const fullText = questionText;
  
  const preview = fullText.substring(0, 50) + '...';
  debugLog('[END] buildQuestionState', `textPreview: "${preview}"`);
  
  return fullText;
}
