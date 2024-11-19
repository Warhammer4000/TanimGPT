import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Button } from '../../components/ui/button';
import { Trash2, MessageSquarePlus, Edit2, Check, X } from 'lucide-react';
import { generateId, cn } from '../../lib/utils';

export function ChatList() {
  const { chats, activeChat, setActiveChat, addChat, deleteChat, updateChat } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const createNewChat = () => {
    const newChat = {
      id: generateId(),
      title: `Chat ${chats.length + 1}`,
      messages: [],
      createdAt: Date.now(),
    };
    addChat(newChat);
  };

  const startEditing = (chat: typeof chats[0]) => {
    setEditingId(chat.id);
    setEditTitle(chat.title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      updateChat(editingId, { title: editTitle.trim() });
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const handleClick = (chatId: string) => {
    if (editingId !== chatId) {
      setActiveChat(chatId);
    }
  };

  return (
    <div className="p-4 border-r h-full">
      <Button onClick={createNewChat} className="w-full mb-4">
        <MessageSquarePlus className="mr-2 h-4 w-4" />
        New Chat
      </Button>
      <div className="space-y-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              'flex items-center justify-between p-2 rounded',
              activeChat === chat.id ? 'bg-secondary' : 'hover:bg-muted'
            )}
            onClick={() => handleClick(chat.id)}
          >
            {editingId === chat.id ? (
              <div className="flex items-center gap-2 w-full" onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="flex-1 px-2 py-1 bg-background rounded border"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') cancelEdit();
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={saveEdit}
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={cancelEdit}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className="truncate">{chat.title}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditing(chat);
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}