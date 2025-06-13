import { useState, useMemo  } from 'react';
import {  Edit2 } from 'lucide-react';
import SearchBar from './SearchBar';
import ChatCard from './ChatCard';
import { PriorityRate, ChatType } from './ChatCard';



export const dummyChats: ChatType[] = [
  {
    name: 'James Ocao',
    priorityRate: PriorityRate.HIGH,
    imageUrl: 'https://avatars.githubusercontent.com/u/98975725?s=400&u=4561bade7c6588fd13c0c08b85683b14cca883b7&v=4',
    date: new Date('2025-06-13T10:30:00'),
  },
  {
    name: 'Maria Garcia',
    priorityRate: PriorityRate.NORMAL,
    imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    date: new Date('2025-06-13T11:00:00'),
  },
  {
    name: 'John Doe',
    priorityRate: PriorityRate.LOW,
    imageUrl: null,
    date: new Date('2025-06-12T14:45:00'),
  },
  {
    name: 'Jane Smith',
    priorityRate: PriorityRate.HIGH,
    imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    date: new Date('2025-06-11T09:20:00'),
  },
  {
    name: 'Alex Johnson',
    priorityRate: PriorityRate.NORMAL,
    imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    date: new Date('2025-06-10T16:05:00'),
  },
  {
    name: 'Priya Patel',
    priorityRate: PriorityRate.LOW,
    imageUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
    date: new Date('2025-06-09T08:15:00'),
  },
  {
    name: 'Chen Li',
    priorityRate: PriorityRate.HIGH,
    imageUrl: null,
    date: new Date('2025-06-08T19:30:00'),
  },
  {
    name: 'Ahmed Khan',
    priorityRate: PriorityRate.NORMAL,
    imageUrl: 'https://randomuser.me/api/portraits/men/56.jpg',
    date: new Date('2025-06-07T13:50:00'),
  },
  {
    name: 'Sara Martinez',
    priorityRate: PriorityRate.LOW,
    imageUrl: 'https://randomuser.me/api/portraits/women/22.jpg',
    date: new Date('2025-06-06T21:10:00'),
  },
  {
    name: 'David Brown',
    priorityRate: PriorityRate.HIGH,
    imageUrl: null,
    date: new Date('2025-06-05T07:45:00'),
  },
];


const ConversationList = () => {

    const [searchKey, setSearchKey] = useState<string>("a")
    

    const filteredChats = useMemo(
        () =>
          dummyChats.filter(chat =>
            chat.name.toLowerCase().includes(searchKey.trim().toLowerCase())
          ),
        [searchKey]
      );
    


      return (
        <div className="h-full flex flex-col bg-white dark:bg-slate-800">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Conversations
            </h2>
            <Edit2 className="w-5 h-5 text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition" />
          </div>
    
          {/* Search */}
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <SearchBar searchKey={searchKey} setSearchKey={setSearchKey} />
          </div>
    
          {/* List */}
          <div className="overflow-auto flex-1">
            {filteredChats.length > 0 ? (
              filteredChats.map((chat: ChatType, i) => (
                <ChatCard
                  key={i}
                  {...chat}
                />
              ))
            ) : (
              <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                No Chats Found
              </p>
            )}
          </div>
        </div>
      )
    
}

export default ConversationList