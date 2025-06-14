import React from 'react';
import dayjs from '../../lib/dayjs-setup';

export enum PriorityRate {
  HIGH = 'HIGH',
  NORMAL = 'NORMAL',
  LOW = 'LOW',
}

export interface ChatType {
  id: string;
  name: string;
  priorityRate: PriorityRate | string;
  imageUrl: string | null;
  date: Date;
  changeCurrentFanId?: (id: string) => void;
}

function getRelativeShort(date: Date): string {
  const now = dayjs();
  const then = dayjs(date);
  const m = now.diff(then, 'minute');
  if (m < 60) return `${m}m`;
  const h = now.diff(then, 'hour');
  if (h < 24) return `${h}h`;
  return `${now.diff(then, 'day')}d`;
}

const ChatCard: React.FC<ChatType> = ({
  id,
  name,
  priorityRate,
  imageUrl,
  date,
  changeCurrentFanId,
}) => {
  const time = getRelativeShort(date);

  const { color, label } = (() => {
    switch (priorityRate) {
      case PriorityRate.HIGH:
        return { color: 'bg-red-500', label: 'High priority' };
      case PriorityRate.NORMAL:
      case 'MEDIUM': // if API returns "MEDIUM"
        return { color: 'bg-yellow-500', label: 'Medium' };
      case PriorityRate.LOW:
      default:
        return { color: 'bg-gray-500', label: 'Low' };
    }
  })();

  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer"
      onClick={() => changeCurrentFanId?.(id)}
    >
      {/* Left: Avatar + Info */}
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
            <span className="text-sm text-gray-500 dark:text-gray-400">
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
  );
};

export default ChatCard;
