import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Send, Upload } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() || files.length > 0) {
      onSend(input, files);
      setInput('');
      setFiles([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

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
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={disabled}
          />
          <Button type="submit" disabled={disabled || (!input.trim() && !files.length)}>
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