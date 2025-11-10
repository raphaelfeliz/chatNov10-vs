/* *file-summary*
PATH: src/helpers/buildMessage.ts

PURPOSE: Constructs and returns a Message object.

SUMMARY: Creates a message object with unique id/timestamp, assigns a bubbleVariant
         derived from the role by default, and accepts optional link.

FLOW: Used by newMessageListener and newMessageHandler to standardize message format.

IMPORTS:
- ./nowId.ts // generates id and timestamp

EXPORTS:
- ./buildMessage.ts // default export: buildMessage(role, text, link?, bubbleVariant?)
*/

import nowId from './nowId';

export type MessageRole = 'human' | 'bot' | 'system' | 'assistant' | 'error';
export type BubbleVariant = 'human-message' | 'ai-message' | 'system-message' | 'assistant-message' | 'error-message' | 'whatsappLink';

export interface Message {
  id: string;
  timestamp: number;
  role: MessageRole;
  bubbleVariant: BubbleVariant;
  text: string;
  link: string | null;
}

function getRoleBubbleVariant(role: MessageRole): BubbleVariant {
  switch (role) {
    case 'human':
      return 'human-message';
    case 'bot':
      return 'ai-message';
    case 'system':
      return 'system-message';
    case 'assistant':
      return 'assistant-message';
    case 'error':
      return 'error-message';
    default:
      return 'ai-message';
  }
}

export default function buildMessage(
  role: MessageRole,
  text: string,
  link: string | null = null,
  bubbleVariant?: BubbleVariant
): Message {
  const { id, timestamp } = nowId();
  
  return {
    id,
    timestamp,
    role,
    bubbleVariant: bubbleVariant || getRoleBubbleVariant(role),
    text,
    link,
  };
}
