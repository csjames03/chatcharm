import { useState, useMemo, useEffect  } from 'react';
import {  Edit2 } from 'lucide-react';
import SearchBar from './SearchBar';
import ChatCard from './ChatCard';
import { ChatType } from './ChatCard';
import { MobileScreenCurrentView } from '../App';


const ConversationList = ({changeCurrentFanId, mobileCurrentView}:{changeCurrentFanId: (id: string) => void; mobileCurrentView: (view:MobileScreenCurrentView)=>void;}) => {

    const [loading, setLoading] = useState<boolean>(true)
    const [searchKey, setSearchKey] = useState<string>(" ")
    const [conversationList, setConversationList] = useState<ChatType[]>([])
    
    useEffect(()=>{

        const getConversations = async () => {
            try {
                setLoading(true)
              const res = await fetch('http://localhost:3001/api/conversations');
              if (!res.ok) {
                throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
              }
              const data: ChatType[] = await res.json();

              setConversationList(data)
          
              setLoading(false)
            } catch (error) {
              console.error('Error fetching conversations:', error);
              setLoading(false)
              return []; // or rethrow if you'd rather handle it elsewhere
            }
          };

        getConversations()
    },[])

    const filteredChats = useMemo(() => {
        const key = searchKey.trim().toLowerCase();
        // if searchKey is empty, just return the whole list
        if (!key) {
          return conversationList;
        }
        // otherwise filter
        return conversationList.filter(chat =>
          chat.name.toLowerCase().includes(key)
        );
      }, [searchKey, conversationList]);
    


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
          {
            loading ? (
                <p>LOADING..</p>
            ):(
                <div className="overflow-auto flex-1">
                    {filteredChats.length > 0 ? (
                    filteredChats.map((chat: ChatType, i) => (
                        <ChatCard
                        key={i}
                        id={chat.id}
                        name={chat.name}
                        priorityRate={chat.priorityRate}
                        imageUrl={chat.imageUrl}
                        date={chat.date}
                        changeCurrentFanId={changeCurrentFanId}
                        mobileCurrentView={mobileCurrentView}
                      />
                    ))
                    ) : (
                    <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No Chats Found
                    </p>
                    )}
                </div>
            )
          }
        </div>
      )
    
}

export default ConversationList