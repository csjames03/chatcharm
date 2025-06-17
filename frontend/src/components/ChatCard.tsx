import React from 'react';
import dayjs from '../../lib/dayjs-setup';
import { MobileScreenCurrentView } from '../App';
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
  mobileCurrentView?: (view:MobileScreenCurrentView)=> void;
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
  mobileCurrentView
}) => {
  const time = getRelativeShort(date);

  const { color, label } = (() => {
    switch (priorityRate) {
      case PriorityRate.HIGH:
        return { color: 'bg-red-500', label: 'High Priority' };
      case PriorityRate.NORMAL:
      case 'MEDIUM':
        return { color: 'bg-yellow-500', label: 'Medium Priority' };
      case PriorityRate.LOW:
      default:
        return { color: 'bg-gray-500', label: 'Low Priority' };
    }
  })();

  return (
    <div
      onClick={() => {
        changeCurrentFanId?.(id);
        mobileCurrentView?.(MobileScreenCurrentView.CHAT) ;
        console.log("mobileCurrentView?.(MobileScreenCurrentView.CHAT)", MobileScreenCurrentView.CHAT)
      }}
      className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition cursor-pointer border-b border-gray-200 dark:border-zinc-700"
    >
      {/* Avatar and Info */}
      <div className="flex items-center space-x-4">
        <img
          src={imageUrl ?? '/default-avatar.png'}
          alt={name}
          className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-zinc-600"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800 dark:text-white truncate max-w-[160px]">
            {name}
          </span>
          <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
            <span className={`w-2 h-2 rounded-full ${color}`} />
            <span>{label}</span>
          </div>
        </div>
      </div>

      {/* Time */}
      <span className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
        {time}
      </span>
    </div>
  );
};

export default ChatCard;
