import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import dayjs from '../../lib/dayjs-setup';
import type { Socket } from 'socket.io-client';
import { MobileScreenCurrentView } from '../App';
import { BACKEND_PORT } from '../App';
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
  conversationId: string;
  socket: Socket;
  mobileCurrentView?: (view: MobileScreenCurrentView) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  title,
  fanId,
  socket,
  initialMessages,
  conversationId,
  mobileCurrentView,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [quickReplies, setQuickReplies] = useState<string[]>([]);
  const [quickRepliesVisible, setQuickRepliesVisible] = useState<boolean>(true);

  const hasListener = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(`http://localhost:${BACKEND_PORT}/api/templates`);
        const data = await res.json();
        setQuickReplies(data.map((t: { text: string }) => t.text));
      } catch (err) {
        console.error('[ERROR] Failed to load quick replies:', err);
      }
    };
    fetchTemplates();
  }, []);

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
    if (!hasListener.current) {
      socket.on('receive_message', handleReceiveMessage);
      hasListener.current = true;
    }

    return () => {
      socket.off('receive_message', handleReceiveMessage);
      hasListener.current = false;
    };
  }, [socket, handleReceiveMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const body = {
        conversationId,
        text: input,
        senderType: 'AGENT',
        agentId: 'cmbwidan40000d404vle82elg',
        fanId,
      };

      const response = await fetch(`http://localhost:${BACKEND_PORT}/api/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const savedMessage: Message = await response.json();
      socket.emit('send_message', savedMessage);
      setInput('');

      setIsTyping(true);
      setTimeout(async () => {
        setIsTyping(false);
        const fakeReply = {
          id: Date.now().toString(),
          text: 'Thanks for reaching out! 💬',
          senderType: 'FAN',
          agentId: 'cmbwidan40000d404vle82elg',
          fanId,
          conversationId,
        };

        const replyRes = await fetch(`http://localhost:${BACKEND_PORT}/api/message`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fakeReply),
        });

        if (!replyRes.ok) throw new Error('Failed to send fake reply');

        const savedFakeReply: Message = await replyRes.json();
        socket.emit('send_message', savedFakeReply);
      }, 1500);
    } catch (err) {
      console.error('[ERROR] Failed to send message:', err);
    }
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
      className="flex flex-col h-[calc(100vh-80px)] bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
        <div className="cursor-pointer" onClick={() => mobileCurrentView?.(MobileScreenCurrentView.CONVO_LIST)}>
          <ArrowLeft className="text-gray-700 dark:text-gray-300" size={24} />
        </div>
        <p className="text-2xl font-semibold text-emerald-800 dark:text-emerald-500">{title}</p>
        <div className="cursor-pointer" onClick={() => mobileCurrentView?.(MobileScreenCurrentView.DASHBOARD)}>
          <MoreVertical className="text-gray-700 dark:text-gray-300" size={24} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isAgent = msg.senderType === 'AGENT';
          return (
            <div key={msg.id} className={`flex flex-col ${isAgent ? 'items-end' : 'items-start'}`}>
              <div
                className={`
                  px-4 py-2 rounded-2xl shadow transition-all break-words whitespace-pre-wrap
                  ${isAgent
                    ? 'bg-emerald-600 text-white'
                    : 'bg-zinc-100 text-gray-800 dark:bg-zinc-700 dark:text-gray-100'}
                  max-w-[85%] md:max-w-[60%] w-fit
                `}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <span className={`mt-1 text-xs ${isAgent ? 'text-emerald-200' : 'text-gray-500 dark:text-gray-400'}`}>
                {dayjs(msg.timestamp).fromNow(true)} ago
              </span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-start">
            <div className="px-4 py-2 bg-zinc-100 text-gray-800 dark:bg-zinc-700 dark:text-gray-100 rounded-2xl shadow max-w-[75%] animate-pulse">
              <p className="text-sm">Typing...</p>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Replies Toggle */}
      {quickReplies.length > 0 && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setQuickRepliesVisible(prev => !prev)}
            className="text-sm font-medium text-emerald-600 dark:text-emerald-400 underline hover:text-emerald-800 dark:hover:text-emerald-300 transition mb-2"
          >
            {quickRepliesVisible ? '❌ Hide Quick Replies' : '💬 Show Quick Replies'}
          </button>
        </div>
      )}

      {/* Quick Replies */}
      {quickRepliesVisible && quickReplies.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {quickReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => setInput(reply)}
                className="px-4 py-2 rounded-full text-sm font-medium
                  bg-emerald-100 text-emerald-900 
                  dark:bg-emerald-600 dark:text-white
                  hover:bg-emerald-200 dark:hover:bg-emerald-500 
                  transition-all shadow-sm"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
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
