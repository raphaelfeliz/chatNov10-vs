/* *file-summary*
PATH: src/components/chat/bubble-area/BubbleArea.tsx

PURPOSE: Container component for rendering chat message bubbles.

SUMMARY: Maps an array of Message objects to Bubble components.

FLOW: Receives `messages` prop from App and renders each as a Bubble.

IMPORTS:
- ./bubble.tsx // Bubble component

EXPORTS:
- ./BubbleArea.tsx // named export: BubbleArea
*/

import { Bubble } from './bubble';

interface BubbleAreaProps {
  messages: { id: string; text: string; role: string }[];
}

export function BubbleArea({ messages }: BubbleAreaProps) {
  return (
    <div id="bubble-area" className="p-4 flex flex-col gap-3 bg-transparent">
      {messages.map((m) => (
        <Bubble key={m.id} text={m.text} role={m.role === 'human' ? 'human' : 'bot'} />
      ))}
    </div>
  );
}
