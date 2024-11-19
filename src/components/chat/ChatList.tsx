import React from 'react';
import { useStore } from '../../lib/store';
import { Button } from '../../components/ui/button';
import { Trash2, MessageSquarePlus } from 'lucide-react';
import { generateId, cn } from '../../lib/utils';

export function ChatList() {
  const { chats, activeChat, setActiveChat, addChat, deleteChat } = useStore();

  const createNewChat = () => {
    const newChat = {
      id: generateId(),
      title: `Chat ${chats.length + 1}`,
      messages: [],
      createdAt: Date.now(),
    };
    addChat(newChat);
  };

  return (
    <div className="p-4 border-r h-full">
      <Button
        onClick={createNewChat}
        className="w-full mb-4"
      >
        <MessageSquarePlus className="mr-2 h-4 w-4" />
        New Chat
      </Button>
      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              'flex items-center justify-between p-2 rounded cursor-pointer',
              activeChat === chat.id ? 'bg-secondary' : 'hover:bg-muted'
            )}
            onClick={() => setActiveChat(chat.id)}
          >
            <span className="truncate">{chat.title}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                deleteChat(chat.id);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}