/* *file-summary*
PATH: src/components/chat/input-area/send-button.tsx

PURPOSE: Send button component for chat input.

SUMMARY: Renders a circular send icon button that accepts onClick/disabled callbacks.

FLOW: Used by InputArea to trigger send action.

IMPORTS:
- (none)

EXPORTS:
- ./send-button.tsx // named export: SendButton
*/

interface SendButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function SendButton({ onClick, disabled = false }: SendButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Send message"
      className="flex-shrink-0 bg-[#36C0F2] text-[#0d1a26] rounded-full h-12 w-12 flex items-center justify-center hover:bg-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#36C0F2] focus:ring-offset-2 focus:ring-offset-[#14293D] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    </button>
  );
}
