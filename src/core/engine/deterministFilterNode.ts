/* *file-summary*
PATH: src/core/engine/deterministFilterNode.ts

PURPOSE: Central orchestrator for the deterministic filtering flow.

SUMMARY: Runs the main loop, decides what to ask next based on selectedFacets, 
         applies filtering logic, and returns the next UI state.

FLOW: Called by aiPrompter to determine next question in the facet sequence.

IMPORTS:
- ./productDatabase.ts // Product type and catalog
- ./facetsNode.ts // FACET_ORDER, getFacetLabel
- ./filterUtils.ts // applyFacetFilter, extractOptionsForFacet
- ../../helpers/debugLog.ts // structured logging

EXPORTS:
- ./deterministFilterNode.ts // exports: calculateNextUiState
*/

import { Product } from './productDatabase';
import { FACET_ORDER, getFacetLabel, FacetKey } from './facetsNode';
import { applyFacetFilter, extractOptionsForFacet, sampleImageForOption, SelectedFacets, Option } from './filterUtils';
import debugLog from '../../helpers/debugLog';

export type NextUiState = {
  nextFacet: FacetKey | null;
  filterState: {
    currentQuestion: FacetKey | null;
    currentOptions: Option[];
    questionText: string;
  };
  selectedFacets: SelectedFacets;
  filteredProducts: Product[];
  canFinalize: boolean;
  finalProduct: Product | null;
};

type CalculateConfig = {
  saveFilteredProducts?: (products: Product[]) => void;
};

export function calculateNextUiState(
  selectedFacets: SelectedFacets,
  config: CalculateConfig = {}
): NextUiState {
  debugLog('[START] calculateNextUiState', selectedFacets);
  
  let currentSelectedFacets = { ...selectedFacets };
  let handledFacets: Set<FacetKey> = new Set(Object.keys(currentSelectedFacets).filter(k => currentSelectedFacets[k as FacetKey] !== undefined) as FacetKey[]);

  // This loop will handle auto-skips (zero options) and auto-selects (one option)
  // until a question with more than 1 option is found or the filtering is complete.
  while (true) {
    const filteredProducts = applyFacetFilter(currentSelectedFacets);

    if (config.saveFilteredProducts) {
      config.saveFilteredProducts(filteredProducts);
      debugLog('[PERSIST] filteredProducts', { count: filteredProducts.length });
    }

    // RULE: Terminal case - exactly 1 product remains
    if (filteredProducts.length === 1) {
      const finalProduct = filteredProducts[0];
      debugLog('[RULE] terminalSingleProduct', { slug: finalProduct.slug });
      return {
        nextFacet: null,
        filterState: { currentQuestion: null, currentOptions: [], questionText: '' },
        selectedFacets: currentSelectedFacets,
        filteredProducts,
        canFinalize: true,
        finalProduct,
      };
    }

    // Find the next unanswered facet
    const nextFacet = FACET_ORDER.find(
      (key) => !handledFacets.has(key)
    );

    // If no empty facet, we're done
    if (!nextFacet) {
      debugLog('[END] calculateNextUiState', 'All facets answered');
      return {
        nextFacet: null,
        filterState: { currentQuestion: null, currentOptions: [], questionText: 'Filtragem completa!' },
        selectedFacets: currentSelectedFacets,
        filteredProducts,
        canFinalize: false,
        finalProduct: null,
      };
    }
    
    debugLog('calculateNextUiState [NEXT FACET]', nextFacet);
    handledFacets.add(nextFacet); // Mark as handled for the next iteration

    const rawOptions = extractOptionsForFacet(nextFacet, filteredProducts);

    // RULE: Zero options - skip this facet and continue the loop
    if (rawOptions.length === 0) {
      debugLog('[RULE] zeroOptionsSkip', { facet: nextFacet });
      // No selection is made, just continue to the next facet in the order
      continue; 
    }

    // RULE: Single option - auto-select and continue the loop
    if (rawOptions.length === 1) {
      const autoValue = rawOptions[0].value;
      debugLog('[RULE] singleOptionAutoset', { facet: nextFacet, value: autoValue });
      currentSelectedFacets[nextFacet] = autoValue; // Auto-select
      continue; // Restart loop with the new selection
    }

    // RULE: More than 1 option - present the question to the user
    if (rawOptions.length > 1) {
      debugLog('[STATE] presentQuestion', { facet: nextFacet, optionCount: rawOptions.length });
      const optionsWithImages = rawOptions.map((opt) => ({
        ...opt,
        image: sampleImageForOption(nextFacet, opt.value, filteredProducts, currentSelectedFacets),
      }));

      return {
        nextFacet,
        filterState: {
          currentQuestion: nextFacet,
          currentOptions: optionsWithImages,
          questionText: getFacetLabel(nextFacet),
        },
        selectedFacets: currentSelectedFacets,
        filteredProducts,
        canFinalize: false,
        finalProduct: null,
      };
    }
  }
}
