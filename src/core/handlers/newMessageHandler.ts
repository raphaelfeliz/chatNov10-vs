/* *file-summary*
PATH: src/core/handlers/newMessageHandler.ts

PURPOSE: Central handler for new user messages in the chat flow.

SUMMARY: Receives user input, builds human message, saves it, calls AI prompter with selectedFacets and setConfiguratorQuestion, 
         and appends AI reply message. Logs START and END with timestamps.

FLOW: InputArea -> App.handleSend -> newMessageHandler -> aiPrompter -> message state update + configurator update.

IMPORTS:
- ../../helpers/buildMessage.ts // creates message objects
- ../../helpers/debugLog.ts // structured logging
- ../../helpers/CURRENT_TIMESTAMP.ts // timestamp for logs
- ../ai/aiPrompter.ts // AI reply generator with facet logic
- ../engine/filterUtils.ts // SelectedFacets type

EXPORTS:
- ./newMessageHandler.ts // default export: newMessageHandler(text, appendMessage, selectedFacets, setConfiguratorQuestion)
*/

import buildMessage from '../../helpers/buildMessage';
import debugLog from '../../helpers/debugLog';
import CURRENT_TIMESTAMP from '../../helpers/CURRENT_TIMESTAMP';
import aiPrompter from '../ai/aiPrompter';
import type { SelectedFacets } from '../engine/filterUtils';
import type { Product } from '../engine/productDatabase';

export default async function newMessageHandler(
  text: string,
  appendMessage: (msg: any) => void,
  selectedFacets: SelectedFacets,
  setConfiguratorQuestion: (question: string) => void,
  saveFilteredProducts: (products: Product[]) => void
): Promise<void> {
  debugLog(`[START] newMessageHandler @ ${CURRENT_TIMESTAMP()}`, text);

  // 1. Build human message
  const humanMessage = buildMessage('human', text);
  debugLog('newMessageHandler [HUMAN_MESSAGE]', humanMessage);

  // 2. Append to message state
  appendMessage(humanMessage);
  debugLog('newMessageHandler [SAVED]', 'Human message saved to state');

  // 3. Call AI prompter with selectedFacets, setConfiguratorQuestion, and saveFilteredProducts
  const aiReply = await aiPrompter(text, selectedFacets, setConfiguratorQuestion, saveFilteredProducts);

  // 4. Build AI message
  const aiMessage = buildMessage('bot', aiReply);
  debugLog('newMessageHandler [AI_MESSAGE]', aiMessage);

  // 5. Append AI reply to message state
  appendMessage(aiMessage);

  debugLog(`[END] newMessageHandler @ ${CURRENT_TIMESTAMP()}`, 'Flow complete');
}
