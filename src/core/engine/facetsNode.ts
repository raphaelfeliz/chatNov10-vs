/* *file-summary*
PATH: src/core/engine/facetsNode.ts

PURPOSE: Defines all available facets, their deterministic order, and question text.

SUMMARY: Contains FACET_ORDER array and getFacetLabel function that returns 
         localized Portuguese question strings for each facet.

FLOW: Data layer consumed by deterministFilterNode to determine question sequence.

IMPORTS:
- ../../helpers/debugLog.ts // structured logging

EXPORTS:
- ./facetsNode.ts // exports: FACET_ORDER, getFacetLabel
*/

import debugLog from '../../helpers/debugLog';

export type FacetKey = 
  | 'categoria' 
  | 'sistema' 
  | 'persiana' 
  | 'persianaMotorizada' 
  | 'material' 
  | 'largura' 
  | 'folhasNumber';

export const FACET_ORDER: FacetKey[] = [
  'categoria',
  'sistema',
  'persiana',
  'persianaMotorizada',
  'material',
  'folhasNumber'
];

export function getFacetLabel(facetKey: FacetKey): string {
  const labels: Record<FacetKey, string> = {
    categoria: 'Qual categoria você procura?',
    sistema: 'Qual o sistema de abertura?',
    persiana: 'Você quer com persiana integrada?',
    persianaMotorizada: 'A persiana deve ser motorizada?',
    material: 'Qual material você prefere?',
    largura: 'Qual a largura desejada?',
    folhasNumber: 'Quantas folhas o produto deve ter?'
  };

  return labels[facetKey] || 'Pergunta não definida';
}

export function mapFacetValueToLabel(facetKey: FacetKey, value: string): string {
  // Special mapping rules
  const mappings: Record<FacetKey, Record<string, string>> = {
    persiana: {
      '': 'Não', // Empty value gets "Não" label
      'sim': 'Sim'
    },
    categoria: {
      'janela': 'Janela',
      'porta': 'Porta'
    },
    sistema: {
      'janela-correr': 'Janela de Correr',
      'porta-correr': 'Porta de Correr',
      'maxim-ar': 'Maxim-Ar',
      'giro': 'Giro'
    },
    persianaMotorizada: {
      'motorizada': 'Motorizada',
      'manual': 'Manual'
    },
    material: {
      'vidro': 'Vidro',
      'vidro + veneziana': 'Vidro + Veneziana',
      'lambri': 'Lambri',
      'veneziana': 'Veneziana',
      'vidro + lambri': 'Vidro + Lambri'
    },
  largura: {},
  folhasNumber: {}
  };

  const facetMappings = mappings[facetKey] || {};
  const label = facetMappings[value] !== undefined ? facetMappings[value] : value;
  
  debugLog('mapFacetValueToLabel', { facet: facetKey, value, label });
  
  return label;
}

// Log initialization
debugLog('[INIT] facetsNode', `${FACET_ORDER.length} facets registered`);
