import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import dayjs from '../../lib/dayjs-setup';
import type { Socket } from 'socket.io-client';
import { MobileScreenCurrentView } from '../App';
interface Message {
  id: string;
  text: string;
  senderType: 'AGENT' | 'FAN';
  timestamp: Date;
  conversationId: string;
}

interface ChatScreenProps {
  title: string;
  initialMessages: Message[];
  fanId: string;
  quickReplies?: string[];
  conversationId: string;
  socket: Socket;
  mobileCurrentView?: (view:MobileScreenCurrentView)=> void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  title,
  fanId,
  socket,
  initialMessages,
  conversationId,
  quickReplies = [],
  mobileCurrentView,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const hasListener = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const handleReceiveMessage = useCallback(
    (msg: Message) => {
      if (msg.conversationId !== conversationId) return;

      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev;
        return [...prev, msg];
      });
    },
    [conversationId]
  );

  useEffect(() => {
    if (hasListener.current) return;

    socket.on('receive_message', handleReceiveMessage);
    hasListener.current = true;

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      hasListener.current = false;
    };
  }, [socket, handleReceiveMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      senderType: 'AGENT',
      timestamp: new Date(),
      conversationId,
    };

    setInput('');
    socket.emit('send_message', newMsg);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && endX - touchStartX.current > 80) {
      window.history.back();
    }
    touchStartX.current = null;
  };

  return (
    <div
      className="flex flex-col h-[calc(100vh-80px)] bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100 "
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
        <button aria-label="Go back" onClick={() => {
          mobileCurrentView?.(MobileScreenCurrentView.CONVO_LIST)
        }}>
          <ArrowLeft className="text-gray-700 dark:text-gray-300" size={24} />
        </button>
        <p className="text-2xl font-semibold text-emerald-800 dark:text-emerald-600">{title}</p>
        <button aria-label="More options" onClick={() => {
          mobileCurrentView?.(MobileScreenCurrentView.DASHBOARD)
        }}>
          <MoreVertical className="text-gray-700 dark:text-gray-300" size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isAgent = msg.senderType === 'AGENT';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`
                  px-4 py-2 rounded-2xl shadow transition-all
                  ${isAgent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 text-gray-800 dark:bg-zinc-700 dark:text-gray-100'}
                  max-w-[75%]
                `}
              >
                <p className="text-sm whitespace-pre-line break-words">{msg.text}</p>
              </div>
              <span
                className={`mt-1 text-xs ${isAgent ? 'text-emerald-200' : 'text-gray-500 dark:text-gray-400'}`}
              >
                {dayjs(msg.timestamp).fromNow(true)} ago
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {quickReplies.length > 0 && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => setInput(reply)}
              className="whitespace-nowrap px-4 py-1.5 bg-emerald-100 dark:bg-emerald-600 text-emerald-900 dark:text-white rounded-full text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-500 transition"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center px-4 py-3 border-t border-gray-200 dark:border-zinc-700">
        <input
          type="text"
          className="flex-1 px-4 py-2 bg-zinc-50 dark:bg-zinc-800 text-gray-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
          placeholder="Write a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="ml-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;