/* *file-summary*
PATH: src/components/chat/input-area/input-text.tsx

PURPOSE: Controlled text input component for chat messages.

SUMMARY: Accepts value/onChange/onKeyPress/disabled props and renders a styled input field.

FLOW: Used by InputArea as the text input.

IMPORTS:
- (none)

EXPORTS:
- ./input-text.tsx // named export: InputText
*/

interface InputTextProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function InputText({ 
  value,
  onChange,
  onKeyPress,
  disabled = false,
  placeholder = 'digite aqui'
}: InputTextProps) {
  return (
    <input
      type="text"
      placeholder={disabled ? 'processando...' : placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      disabled={disabled}
      className="flex-1 bg-[#0d1a26] rounded-full py-3 px-5 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#36C0F2] transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    />
  );
}
