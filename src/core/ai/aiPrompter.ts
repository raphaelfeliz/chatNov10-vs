/* *file-summary*
PATH: src/core/ai/aiPrompter.ts

PURPOSE: AI prompt handler that updates configurator with facet questions.

SUMMARY: Calls calculateNextUiState to determine next facet question, updates configurator display,
         and returns simple greeting "O que você procura?" for chat.

FLOW: Called by newMessageHandler; updates configurator UI and returns chat reply.

IMPORTS:
- ../../helpers/debugLog.ts // structured logging
- ../engine/deterministFilterNode.ts // calculateNextUiState
- ../engine/filterUtils.ts // SelectedFacets type

EXPORTS:
- ./aiPrompter.ts // default export: aiPrompter(prompt, selectedFacets, setConfiguratorQuestion) => Promise<string>
*/

import debugLog from '../../helpers/debugLog';
import { calculateNextUiState } from '../engine/deterministFilterNode';
import type { SelectedFacets } from '../engine/filterUtils';
import type { Product } from '../engine/productDatabase';

export default async function aiPrompter(
  prompt: string, 
  selectedFacets: SelectedFacets,
  setConfiguratorQuestion: (question: string) => void,
  saveFilteredProducts: (products: Product[]) => void
): Promise<string> {
  debugLog('aiPrompter [PROMPT]', prompt);
  
  // Mock delay to simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  // Calculate next UI state to get the current facet question
  const nextUiState = calculateNextUiState(selectedFacets, {
    saveFilteredProducts
  });
  
  debugLog('[FILTER SNAPSHOT]', { count: nextUiState.filteredProducts.length });
  
  // Check if we can finalize (terminal case: 1 product)
  if (nextUiState.canFinalize && nextUiState.finalProduct) {
    debugLog('aiPrompter [PRESENT]', { 
      mode: 'final', 
      slug: nextUiState.finalProduct.slug 
    });
    
    setConfiguratorQuestion(''); // No question for final state
    
    // Return final product message
    return `Encontrei o produto perfeito: ${nextUiState.finalProduct.slug}`;
  }
  
  // Present question mode
  if (nextUiState.nextFacet) {
    debugLog('aiPrompter [PRESENT]', { 
      mode: 'question', 
      facet: nextUiState.nextFacet,
      optionCount: nextUiState.filterState.currentOptions.length
    });
    setConfiguratorQuestion(nextUiState.filterState.questionText);
    debugLog('aiPrompter [FACET SELECTED]', nextUiState.nextFacet);
    debugLog('aiPrompter [REPLY]', nextUiState.filterState.questionText);
    return nextUiState.filterState.questionText;
  } else {
    debugLog('aiPrompter [PRESENT]', { mode: 'complete' });
    setConfiguratorQuestion('Filtragem completa!');
    debugLog('aiPrompter [REPLY]', 'Filtragem completa!');
    return 'Filtragem completa!';
  }
}
