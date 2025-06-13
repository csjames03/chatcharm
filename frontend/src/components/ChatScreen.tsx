// ChatScreen.tsx
import React, { useState } from 'react'
import { ArrowLeft, MoreVertical } from 'lucide-react'
import dayjs from '../../lib/dayjs-setup'  // make sure you extended relativeTime

interface Message {
  id: string
  text: string
  type: 'sent' | 'received'
  timestamp: Date
}

interface ChatScreenProps {
  title: string
  initialMessages: Message[]
  quickReplies?: string[]
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  title,
  initialMessages,
  quickReplies = [],
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')

  const sendMessage = () => {
    if (!input.trim()) return
    const newMsg: Message = {
      id: Date.now().toString(),
      text: input,
      type: 'sent',
      timestamp: new Date(),
    }
    setMessages([...messages, newMsg])
    setInput('')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]n bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <button aria-label="Go back">
          <ArrowLeft className="text-gray-700 dark:text-gray-300" size={24} />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
        <button aria-label="More options">
          <MoreVertical className="text-gray-700 dark:text-gray-300" size={24} />
        </button>
      </div>

      {/* ─── Messages ───────────────────────────────────────── */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map(msg => {
          const isSent = msg.type === 'sent'
          return (
            <div
              key={msg.id}
              className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  relative
                  px-4 py-2 rounded-xl
                  ${isSent
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100'}
                  max-w-xs sm:max-w-md
                `}
              >
                <p>{msg.text}</p>
                <span
                  className={`
                    absolute text-[10px]
                    ${isSent ? 'text-blue-200' : 'text-gray-500 dark:text-gray-400'}
                    bottom-1 right-2
                  `}
                >
                  {dayjs(msg.timestamp).fromNow(true)} ago
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* ─── Quick Replies ──────────────────────────────────── */}
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

      {/* ─── Input Bar ─────────────────────────────────────── */}
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
  )
}

export default ChatScreen
