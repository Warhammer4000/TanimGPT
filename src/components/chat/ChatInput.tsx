import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Send, Upload } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200); // Max height of 200px
      textarea.style.height = `${Math.max(40, newHeight)}px`; // Min height of 40px
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || files.length > 0) {
      onSend(input, files);
      setInput('');
      setFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = '40px'; // Reset height
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  if (disabled) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
          <label htmlFor="file-upload">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              <Upload className="h-4 w-4" />
            </Button>
          </label>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift + Enter for new line)"
            className="flex-1 p-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-y-auto leading-normal"
            style={{ height: '40px' }}
          />
          <Button type="submit" disabled={!input.trim() && !files.length}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {files.length > 0 && (
          <div className="mt-2 flex gap-2 flex-wrap">
            {files.map((file) => (
              <div key={file.name} className="text-sm bg-muted px-2 py-1 rounded">
                {file.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </form>
  );
}