/* *file-summary*
PATH: src/components/options/OptionGrid.tsx

PURPOSE: Grid container that renders multiple OptionCard components.

SUMMARY: Displays question text (if provided) and a responsive grid of option cards.
         Each card click triggers onSelect callback with the chosen value.

FLOW: Rendered by configurator in App.jsx; passes click events up via onSelect.

IMPORTS:
- ./OptionCard.tsx // individual option card
- ../../helpers/debugLog.ts // structured logging

EXPORTS:
- ./OptionGrid.tsx // default export: OptionGrid component
*/

import OptionCard from './OptionCard';
import debugLog from '../../helpers/debugLog';

type Option = {
  value: string;
  label: string;
  image?: string;
};

type OptionGridProps = {
  facetKey: string;
  questionText?: string;
  options: Option[];
  onSelect: (value: string) => void;
};

export default function OptionGrid({
  facetKey,
  questionText,
  options,
  onSelect
}: OptionGridProps) {
  debugLog('[UI] OptionGrid [RENDER]', { facet: facetKey, optionCount: options.length });

  return (
    <div className="w-full">
      {questionText && (
        <div className="mb-4 text-lg font-semibold text-gray-700">
          {questionText}
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {options.map((option) => (
          <OptionCard
            key={option.value}
            value={option.value}
            label={option.label}
            image={option.image}
            onClick={onSelect}
            facet={facetKey}
          />
        ))}
      </div>
    </div>
  );
}
