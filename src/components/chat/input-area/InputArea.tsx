/* *file-summary*
PATH: src/components/chat/input-area/InputArea.tsx

PURPOSE: Manages the chat input area with text field and send button.

SUMMARY: Stateful component that handles input value, Enter key, and send action.

FLOW: User types in InputText, presses Enter or clicks SendButton, triggers onSend callback.

IMPORTS:
- ./input-text.tsx // InputText component
- ./send-button.tsx // SendButton component

EXPORTS:
- ./InputArea.tsx // named export: InputArea
*/

import React, { useState } from 'react';
import { InputText } from './input-text';
import { SendButton } from './send-button';

interface InputAreaProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export function InputArea({ onSend, disabled = false }: InputAreaProps) {
  const [value, setValue] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function doSend() {
    const text = value.trim();
    if (!text) return;
    setValue('');
    onSend(text);
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      doSend();
    }
  }

  return (
    <div className="p-4 bg-[#14293D] border-t border-gray-600">
      <div className="flex items-center space-x-3">
        <InputText value={value} onChange={handleChange} onKeyPress={handleKeyPress} disabled={disabled} />
        <SendButton onClick={doSend} disabled={disabled} />
      </div>
    </div>
  );
}
