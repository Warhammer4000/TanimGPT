import { useEffect, useRef, useState } from 'react';
import { useStore } from './lib/store';
import { ChatList } from './components/chat/ChatList';
import { ChatMessage } from './components/chat/ChatMessage';
import { ChatInput } from './components/chat/ChatInput';
import { SettingsDialog } from './components/settings/SettingsDialog';
import { parseFile, ParsedFile } from './lib/fileParser';

export default function App() {
  const { 
    chats, 
    activeChat, 
    settings,
    addMessage,
    updateSettings
  } = useStore();

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeMessages = chats.find(chat => chat.id === activeChat)?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  useEffect(() => {
    const validateUrl = async () => {
      if (settings.lmStudioUrl) {
        try {
          const response = await fetch(`${settings.lmStudioUrl}/v1/models`);
          if (!response.ok) throw new Error();
          setError(null);
          const data = await response.json();
          if (data.data?.[0]?.id) {
            updateSettings({ activeModel: data.data[0].id });
          }
        } catch {
          setError('Unable to connect to LMStudio. Please check the URL in settings and ensure LMStudio is running.');
        }
      }
    };
    validateUrl();
  }, [settings.lmStudioUrl, updateSettings]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!settings.lmStudioUrl) {
      setError('Please configure LMStudio URL in settings first');
      return;
    }

    if (error) {
      return;
    }

    setIsProcessing(true);
    let parsedFiles: ParsedFile[] = [];
    
    try {
      if (files?.length) {
        parsedFiles = await Promise.all(files.map(parseFile));
        const errors = parsedFiles.filter(file => file.error);
        if (errors.length > 0) {
          console.warn('Some files had parsing errors:', errors);
        }
      }

      // Create the user message with files
      const userMessage = {
        id: Math.random().toString(),
        role: 'user' as const,
        content,
        timestamp: Date.now(),
        files
      };

      addMessage(activeChat!, userMessage);

      // Build chat history for context
      const chatHistory = activeMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Prepare the current message with file contents
      let messageContent = content;
      if (parsedFiles.length > 0) {
        messageContent += '\n\nAttached Files:\n' + parsedFiles.map(file => {
          const header = `[File: ${file.name} (${file.type})]`;
          if (file.error) {
            return `${header}\nError: ${file.error}`;
          }
          return `${header}\nContent:\n${file.content}`;
        }).join('\n\n');
      }

      // Add the current message to history
      chatHistory.push({
        role: 'user',
        content: messageContent
      });

      const response = await fetch(`${settings.lmStudioUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: chatHistory,
          model: settings.activeModel,
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from LMStudio');
      }

      const data = await response.json();
      const assistantMessage = {
        id: Math.random().toString(),
        role: 'assistant' as const,
        content: data.choices[0].message.content,
        timestamp: Date.now(),
      };

      addMessage(activeChat!, assistantMessage);
    } catch (error) {
      setError('Failed to communicate with LMStudio. Please check your connection.');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen flex bg-background text-foreground">
      <div className="w-64 bg-background border-r shrink-0">
        <ChatList />
      </div>
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b flex items-center justify-between px-4 shrink-0">
          <h1 className="text-xl font-bold">TanimGPT</h1>
          <SettingsDialog />
        </header>

        <div className="flex-1 overflow-auto">
          {error && (
            <div className="p-4 m-4 bg-destructive/10 text-destructive rounded-md">
              {error}
            </div>
          )}
          {activeChat ? (
            <div className="flex flex-col">
              {activeMessages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  typingAnimation={settings.typingAnimation}
                  typingSpeed={settings.typingSpeed}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select or create a chat to get started
            </div>
          )}
        </div>

        <ChatInput
          onSend={handleSendMessage}
          disabled={!activeChat || !settings.lmStudioUrl || !!error || isProcessing}
        />
      </div>
    </div>
  );
}