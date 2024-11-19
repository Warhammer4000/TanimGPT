import React, { useEffect, useRef } from 'react';
import { useStore } from './lib/store';
import { ChatList } from './components/chat/ChatList';
import { ChatMessage } from './components/chat/ChatMessage';
import { ChatInput } from './components/chat/ChatInput';
import { SettingsDialog } from './components/settings/SettingsDialog';
import { validateLMStudioUrl } from './lib/utils';

export default function App() {
  const { 
    chats, 
    activeChat, 
    settings,
    addMessage,
    updateSettings
  } = useStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeMessages = chats.find(chat => chat.id === activeChat)?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  useEffect(() => {
    const validateUrl = async () => {
      if (settings.lmStudioUrl) {
        const isValid = await validateLMStudioUrl(settings.lmStudioUrl);
        if (isValid) {
          const response = await fetch(`${settings.lmStudioUrl}/v1/models`);
          const data = await response.json();
          if (data.data?.[0]?.id) {
            updateSettings({ activeModel: data.data[0].id });
          }
        }
      }
    };
    validateUrl();
  }, [settings.lmStudioUrl]);

  const handleSendMessage = async (content: string, files?: File[]) => {
    if (!settings.lmStudioUrl) {
      alert('Please configure LMStudio URL in settings first');
      return;
    }

    const userMessage = {
      id: Math.random().toString(),
      role: 'user' as const,
      content,
      timestamp: Date.now(),
    };

    addMessage(activeChat!, userMessage);

    try {
      const response = await fetch(`${settings.lmStudioUrl}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content }],
          model: settings.activeModel,
        }),
      });

      const data = await response.json();
      const assistantMessage = {
        id: Math.random().toString(),
        role: 'assistant' as const,
        content: data.choices[0].message.content,
        timestamp: Date.now(),
      };

      addMessage(activeChat!, assistantMessage);
    } catch (error) {
      console.error('Error:', error);
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
          disabled={!activeChat || !settings.lmStudioUrl}
        />
      </div>
    </div>
  );
}