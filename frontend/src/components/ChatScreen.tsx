import React, { useState } from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import dayjs from '../../lib/dayjs-setup';

interface Message {
  id: string;
  text: string;
  senderType: 'AGENT' | 'FAN';
  timestamp: Date;
}

interface ChatScreenProps {
  title: string;
  initialMessages: Message[];
  quickReplies?: string[];
  conversationId: string,
  fanId: string
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  title,
  fanId,
  initialMessages,
  conversationId,
  quickReplies = [],
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
  
    try {
      const response = await fetch('http://localhost:3001/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId:conversationId ,       // replace with actual conversation ID
          senderType: 'AGENT',
          text: input,
          agentId: 'cmbwidan40000d404vle82elg', // dynamically pass agentId if available
          fanId: fanId
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
  
      const newMessage: Message = await response.json();
      setMessages(prev => [...prev, newMessage]);
      

      setTimeout(async()=>{
        const response = await fetch('http://localhost:3001/api/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            conversationId:conversationId ,       // replace with actual conversation ID
            senderType: 'FAN',
            text: `This is the reply to the ${input}`,
            agentId: 'cmbwidan40000d404vle82elg', // dynamically pass agentId if available
            fanId: fanId
          })
        });
    
        if (!response.ok) {
          throw new Error('Failed to send message');
        }
    
        const newMessage: Message = await response.json();
        setMessages(prev => [...prev, newMessage]);
        setInput('');
      }, 2500)
    } catch (error) {
      console.error('Error sending message:', error);
      // optionally show a toast/toastr here
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <button aria-label="Go back">
          <ArrowLeft className="text-gray-700 dark:text-gray-300" size={24} />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
        <button aria-label="More options">
          <MoreVertical className="text-gray-700 dark:text-gray-300" size={24} />
        </button>
      </div>

      {/* Messages */}
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
            px-4 py-2 rounded-2xl shadow-md transition-all
            ${isAgent
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'}
            max-w-[75%]
          `}
        >
          <p className="text-sm whitespace-pre-line break-words">{msg.text}</p>
        </div>
        <span
          className={`mt-1 text-xs ${isAgent ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}`}
        >
          {dayjs(msg.timestamp).fromNow(true)} ago
        </span>
      </div>
    );
  })}
</div>


      {/* Quick Replies */}
      {quickReplies.length > 0 && (
        <div className="px-4 pb-2 space-x-2 overflow-x-auto">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => setInput(reply)}
              className="
                whitespace-nowrap px-3 py-1
                bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200
                rounded-full text-sm
                hover:bg-gray-300 dark:hover:bg-gray-700
                transition
              "
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* Input Bar */}
      <div className="flex items-center px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <input
          type="text"
          className="
            flex-1 px-4 py-2
            bg-gray-100 dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            rounded-full
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition
          "
          placeholder="Write a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="
            ml-3
            text-blue-600 disabled:text-blue-300
            font-medium
            transition
          "
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
