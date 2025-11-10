/* *file-summary*
PATH: src/core/engine/filterUtils.ts

PURPOSE: Low-level filtering logic and utilities for extracting options and handling facet data.

SUMMARY: Provides applyFacetFilter to filter products by selected facets, and 
         extractOptionsForFacet to list valid options for a facet from remaining products.

FLOW: Used by deterministFilterNode to filter products and extract available options.

IMPORTS:
- ./productDatabase.ts // Product type and PRODUCT_CATALOG
- ../../helpers/debugLog.ts // structured logging

EXPORTS:
- ./filterUtils.ts // exports: applyFacetFilter, extractOptionsForFacet
*/

import { Product, PRODUCT_CATALOG } from './productDatabase';
import debugLog from '../../helpers/debugLog';
import type { FacetKey } from './facetsNode';
import { mapFacetValueToLabel } from './facetsNode';

export type SelectedFacets = {
  [key: string]: string | null;
};

export type Option = {
  label: string;
  value: string;
  image?: string;
};

// Check if a facet value should be ignored in filtering
export function isEmptyFacetValue(value: any): boolean {
  if (value === null || value === undefined || value === '') {
    return true;
  }
  
  // For range objects (like largura), check if both min and max are missing
  if (typeof value === 'object' && !Array.isArray(value)) {
    const hasMin = value.min !== null && value.min !== undefined && value.min !== '';
    const hasMax = value.max !== null && value.max !== undefined && value.max !== '';
    return !hasMin && !hasMax;
  }
  
  return false;
}

// Build a predicate function that checks if a product matches selected facets
export function buildFacetPredicate(selectedFacets: SelectedFacets): (product: Product) => boolean {
  return (product: Product) => {
    // Check each facet in selectedFacets
    for (const [facetKey, facetValue] of Object.entries(selectedFacets)) {
      // Skip empty facets
      if (isEmptyFacetValue(facetValue)) {
        continue;
      }

      // Special case: persianaMotorizada only applies if persiana is "sim"
      if (facetKey === 'persianaMotorizada') {
        if (selectedFacets.persiana !== 'sim') {
          continue;
        }
      }

      // Special case: largura (width range)
      if (facetKey === 'largura' && typeof facetValue === 'object' && facetValue !== null) {
        const range = facetValue as { min?: number; max?: number };

        // If min is specified, product's maxLargura must be >= min
        if (range.min !== undefined && range.min !== null) {
          if (product.maxLargura < range.min) {
            return false;
          }
        }

        // If max is specified, product's minLargura must be <= max
        if (range.max !== undefined && range.max !== null) {
          if (product.minLargura > range.max) {
            return false;
          }
        }

        continue;
      }

      // Special case: folhasNumber (convert to number for comparison)
      if (facetKey === 'folhasNumber') {
        const productValue = product[facetKey as keyof Product];
        if (productValue !== Number(facetValue)) {
          return false;
        }
        continue;
      }

      // Standard facet matching
      const productValue = product[facetKey as keyof Product];
      if (productValue !== facetValue) {
        return false;
      }
    }

    return true;
  };
}

// Log filtered products with full object visibility
export function logFilteredProducts(products: Product[]): void {
  debugLog('filteredProducts [DATA]', { count: products.length });
  console.dir(products, { depth: null });
  
  // Optional: for very large result sets, also show a table preview
  if (products.length > 100) {
    console.table(products.slice(0, 50));
  }
}

export function applyFacetFilter(selectedFacets: SelectedFacets): Product[] {
  debugLog('applyFacetFilter [START]', {
    criteriaKeys: Object.entries(selectedFacets)
      .filter(([_, value]) => !isEmptyFacetValue(value))
      .map(([key]) => key)
  });

  const allProducts = PRODUCT_CATALOG;
  const predicate = buildFacetPredicate(selectedFacets);
  const filtered = allProducts.filter(predicate);

  debugLog('applyFacetFilter [END]', { count: filtered.length });
  logFilteredProducts(filtered);

  return filtered;
}

export function extractOptionsForFacet(facetKey: FacetKey, products: Product[]): Option[] {
  debugLog('[START] extractOptionsForFacet', facetKey);
  
  const uniqueValues = new Set<string>();
  
  // Extract unique values for the facet from products
  products.forEach(product => {
    const value = product[facetKey as keyof Product];
    if (value !== null && value !== undefined) {
      uniqueValues.add(String(value));
    }
  });
  
  // Convert to options array with proper labels using mapFacetValueToLabel
  const options: Option[] = Array.from(uniqueValues).map(value => ({
    label: mapFacetValueToLabel(facetKey, value),
    value: value
  }));
  
  debugLog('[END] extractOptionsForFacet', `count: ${options.length}`);
  return options;
}

// Get sample image for an option by finding first matching product
export function sampleImageForOption(
  facetKey: FacetKey,
  value: string,
  filteredProducts: Product[],
  selectedFacets: SelectedFacets
): string | undefined {
  // Special case: for folhasNumber, value should be a number
  let testValue: any = value;
  if (facetKey === 'folhasNumber') {
    testValue = Number(value);
  }
  const testFacets = { ...selectedFacets, [facetKey]: testValue };

  // Find first product that matches these facets
  const predicate = buildFacetPredicate(testFacets);
  const matchingProduct = filteredProducts.find(predicate);

  if (matchingProduct) {
    debugLog('sampleImageForOption [HIT]', { 
      facet: facetKey, 
      value, 
      slug: matchingProduct.slug 
    });
    return matchingProduct.image;
  }

  debugLog('sampleImageForOption [MISS]', { facet: facetKey, value });
  return undefined;
}
