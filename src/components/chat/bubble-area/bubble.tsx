/* *file-summary*
PATH: src/components/chat/bubble-area/bubble.tsx

PURPOSE: Visual component for a single chat message bubble.

SUMMARY: Renders a styled chat bubble with role-based styling (human/bot).

FLOW: Used by BubbleArea to render individual messages.

IMPORTS:
- (none)

EXPORTS:
- ./bubble.tsx // named export: Bubble
*/

interface BubbleProps {
  text: string;
  role: 'human' | 'bot';
}

export function Bubble({ text, role }: BubbleProps) {
  const isIncoming = role === 'bot';

  // Restore original bubble colors
  const bubbleClasses = isIncoming
    ? 'bg-[#14293D] text-white rounded-t-2xl rounded-br-2xl p-4 max-w-[75%] shadow-[0_0_12px_0_rgba(128,0,255,0.18)]'
    : 'bg-[#36C0F2] text-[#0d1a26] rounded-t-2xl rounded-bl-2xl p-4 max-w-[75%] shadow-[0_0_12px_0_rgba(128,0,255,0.18)]';

  const wrapperClasses = isIncoming ? 'flex justify-start' : 'flex justify-end';

  return (
    <div className={wrapperClasses}>
      <div className={bubbleClasses}>
        <p className="text-sm">{text}</p>
      </div>
    </div>
  );
}
