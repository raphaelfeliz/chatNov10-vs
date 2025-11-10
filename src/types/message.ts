/* *file-summary*
PATH: src/types/message.ts

PURPOSE: Define the message data structure.

SUMMARY: TypeScript interface and types for chat messages.
*/

export interface ChatMessage {
  id: number;
  timestamp: string;
  role: 'human' | 'bot';
  bubbleVariant: 'regular-human' | 'regular-bot' | 'whatsapp-link';
  message: string;
  link?: string;
}

export type MessageRole = 'human' | 'bot';
export type BubbleVariant = 'regular-human' | 'regular-bot' | 'whatsapp-link';
