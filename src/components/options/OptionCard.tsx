/* *file-summary*
PATH: src/components/options/OptionCard.tsx

PURPOSE: Visual card component for a single selectable option.

SUMMARY: Displays image (if provided), label text, and handles click events.
         Supports selected and disabled states for visual feedback.

FLOW: Rendered by OptionGrid; emits onClick(value) when user clicks card.

IMPORTS:
- ../../helpers/debugLog.ts // structured logging

EXPORTS:
- ./OptionCard.tsx // default export: OptionCard component
*/

import debugLog from '../../helpers/debugLog';

type OptionCardProps = {
  value: string;
  label: string;
  image?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick: (value: string) => void;
  facet?: string; // For debug logging context
};

export default function OptionCard({
  value,
  label,
  image,
  selected = false,
  disabled = false,
  onClick,
  facet
}: OptionCardProps) {
  debugLog('[UI] OptionCard [RENDER]', { facet, value, label });

  function handleClick() {
    if (disabled) return;
    
    debugLog('[UI] OptionCard [CLICK]', { facet, value });
    onClick(value);
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-center
        p-4 rounded-lg border-2 transition-all
        ${selected ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-blue-400 hover:shadow-md cursor-pointer'}
        min-h-[120px]
      `}
    >
      {image && (
        <div className="w-full h-20 mb-2 flex items-center justify-center">
          <img
            src={image}
            alt={label}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
      <div className="text-center font-medium text-gray-800">
        {label}
      </div>
    </button>
  );
}
