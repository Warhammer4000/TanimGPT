import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Message } from '../../lib/store';
import { Button } from '../ui/button';
import { Copy, FileText } from 'lucide-react';
import { AnimatedText } from './AnimatedText';
import { cn } from '../../lib/utils';

interface ChatMessageProps {
  message: Message;
  typingAnimation?: boolean;
  typingSpeed?: number;
}

export function ChatMessage({ message, typingAnimation, typingSpeed = 30 }: ChatMessageProps) {
  const [isTypingComplete, setIsTypingComplete] = useState(!typingAnimation || !message.animated);
  const isAssistant = message.role === 'assistant';
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [message.content, isTypingComplete]);

  const renderAttachments = () => {
    if (!message.files?.length) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="flex items-center gap-2 p-2 bg-muted rounded"
          >
            <FileText className="h-4 w-4" />
            <span className="text-sm">{file.name}</span>
          </div>
        ))}
      </div>
    );
  };

  const MessageContent = () => (
    <ReactMarkdown
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => navigator.clipboard.writeText(String(children))}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <SyntaxHighlighter
                {...props}
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="max-w-full overflow-x-auto"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code {...props} className={className}>
              {children}
            </code>
          );
        },
        p: ({ children }) => <p className="whitespace-pre-wrap break-words">{children}</p>,
      }}
    >
      {isTypingComplete ? message.content : ''}
    </ReactMarkdown>
  );

  return (
    <div 
      ref={messageRef}
      className={cn(
        'py-4 px-6',
        isAssistant ? 'bg-secondary' : 'bg-background',
        'text-foreground'
      )}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-start gap-4">
          <div className={cn(
            'w-8 h-8 shrink-0 rounded-full flex items-center justify-center',
            isAssistant ? 'bg-primary' : 'bg-muted'
          )}>
            {isAssistant ? '🤖' : '👤'}
          </div>
          <div className="flex-1 min-w-0">
            {typingAnimation && isAssistant && message.animated && !isTypingComplete ? (
              <AnimatedText 
                text={message.content}
                speed={typingSpeed}
                onComplete={() => setIsTypingComplete(true)}
              />
            ) : (
              <>
                <MessageContent />
                {renderAttachments()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}