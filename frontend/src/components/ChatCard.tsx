// ChatCard.tsx
import React from 'react'
import dayjs from '../../lib/dayjs-setup'
export enum PriorityRate { HIGH, NORMAL, LOW }
export interface ChatType {
  name: string
  priorityRate: PriorityRate
  imageUrl: string | null
  date: Date
  // you could add lastMessageType?: 'sent' | 'received'
}

// helper → “3m”, “2h”, “5d”
function getRelativeShort(date: Date) {
  const now = dayjs()
  const then = dayjs(date)
  const m = now.diff(then, 'minute')
  if (m < 60) return `${m}m`
  const h = now.diff(then, 'hour')
  if (h < 24) return `${h}h`
  return `${now.diff(then, 'day')}d`
}

const ChatCard: React.FC<ChatType> = ({
  name,
  priorityRate,
  imageUrl,
  date,
}) => {
  const time = getRelativeShort(date)
  const color =
    priorityRate === PriorityRate.HIGH
      ? 'bg-red-500'
      : priorityRate === PriorityRate.NORMAL
      ? 'bg-yellow-500'
      : 'bg-gray-500'
  const label =
    priorityRate === PriorityRate.HIGH
      ? 'High priority'
      : priorityRate === PriorityRate.NORMAL
      ? 'Medium'
      : 'Low'

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
      {/* Left */}
      <div className="flex items-center space-x-3">
        <img
          src={imageUrl ?? '/default-avatar.png'}
          alt={name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-gray-900 dark:text-white font-medium">
            {name}
          </span>
          <div className="flex items-center space-x-2">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              {/* optionally show an arrow for received */}
              {/* <ArrowDownLeft className="w-3 h-3 mr-1 text-gray-400" /> */}
              {label}
            </span>
          </div>
        </div>
      </div>

      {/* Right: time */}
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {time}
      </span>
    </div>
  )
}

export default ChatCard
