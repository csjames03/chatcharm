import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import NavigationBar from './components/NavigationBar';
import ConversationList from './components/ConversationList';
import ChatScreen from './components/ChatScreen';
import DashboardOverview, {
  FanProfile,
  SpendingPoint,
} from './components/DashBoardOverview';
import dayjs from 'dayjs';
import { calculateConversionMetrics } from '../lib/calculateConversionMetrics';

interface Message {
  id: string;
  text: string;
  senderType: 'AGENT' | 'FAN';
  timestamp: Date;
  conversationId: string;
}

export const BACKEND_PORT = import.meta.env.BACKEND_PORT || '3001';


const daysOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const socket: Socket = io(`http://localhost:${BACKEND_PORT}`);
export enum MobileScreenCurrentView  {
  CONVO_LIST,
  CHAT,
  DASHBOARD
} 

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [chatScreenFan, setChatScreenFan] = useState<any>({});
  const [currentFanProfile, setCurrentFanProfile] = useState<FanProfile>({
    name: '',
    imageUrl: '',
    subscribedSince: '',
  });
  const [currentFanId, setCurrentFanId] = useState<string>('cmbwifrd30001d404pwh942yl');
  const [spendingData, setSpendingData] = useState<SpendingPoint[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [conversionRate, setConversionRate] = useState(0);
  const [churnRate, setChurnRate] = useState(0);
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(max-width: 768px)').matches;
    }
    return false;
  });
  const [mobileCurrentView, setMobileCurrentView] = useState<MobileScreenCurrentView>(MobileScreenCurrentView.CONVO_LIST)

  useEffect(() => {
    const getFanData = async () => {
      try {
        setMessagesLoading(true);

        const res = await fetch(`http://localhost:${BACKEND_PORT}/api/conversation/${currentFanId}`);
        if (!res.ok) throw new Error(`Failed to fetch conversation: ${res.statusText}`);
        const data = await res.json();

        setMessages(data?.messages || []);
        setChatScreenFan(data);
        setCurrentConversationId(data.id);
        setCurrentFanProfile({
          name: data.fan.name,
          imageUrl: data.fan.avatarUrl,
          subscribedSince: data.fan.subscribeSince || 'N/A',
        });

        const spendRes = await fetch(`http://localhost:${BACKEND_PORT}/api/fans/${data.fan.id}`);
        if (!spendRes.ok) throw new Error(`Failed to fetch spending: ${spendRes.statusText}`);
        const spendData = await spendRes.json();

        const dayMap: Record<string, number> = {};
        spendData.spendings.forEach((s: any) => {
          const day = dayjs(s.date).format('ddd');
          dayMap[day] = (dayMap[day] || 0) + s.amount;
        });

        const converted: SpendingPoint[] = daysOrder.map((day) => ({
          day,
          amount: dayMap[day] || 0,
        }));

        setSpendingData(converted);

        const metrics = calculateConversionMetrics(converted);
        setConversionRate(metrics.conversionRate);
        setChurnRate(metrics.churnRate);
      } catch (error) {
        console.error('Error loading fan data:', error);
        setMessages([]);
        setCurrentFanProfile({ name: '', imageUrl: '', subscribedSince: '' });
        setSpendingData([]);
        setConversionRate(0);
        setChurnRate(0);
      } finally {
        setMessagesLoading(false);
      }
    };

    getFanData();
  }, [currentFanId]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
  
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };
  
    // Initial value
    setIsMobile(mediaQuery.matches);
    console.log("setIsMobile", isMobile)
  
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
  
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  

  return (
    <div className="font-mono w-screen h-screen bg-white dark:bg-zinc-900">
      <NavigationBar />
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar */}
        <div className={`${mobileCurrentView  != MobileScreenCurrentView.CONVO_LIST && isMobile && 'hidden'} w-full lg:w-80 border-r border-gray-200 dark:border-gray-700 `}>
        <ConversationList 
          changeCurrentFanId={setCurrentFanId} 
          mobileCurrentView={setMobileCurrentView} 
        />
          
        </div>

        {/* Main Chat */}
        <div className={`flex-1 relative w-full min-w-[300px] overflow-hidden ${mobileCurrentView  != MobileScreenCurrentView.CHAT && isMobile && 'hidden'}`}>
          <AnimatePresence mode="wait">
            {messagesLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-center items-center h-full"
              >
                <p className="text-gray-500 dark:text-gray-300">Loading...</p>
              </motion.div>
            ) : (
              <motion.div
                key={currentConversationId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <ChatScreen
                  title={chatScreenFan?.fan?.name || 'Conversation'}
                  initialMessages={messages}
                  fanId={currentFanId}
                  mobileCurrentView={setMobileCurrentView} 
                  conversationId={currentConversationId}
                  socket={socket}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Sidebar */}
        <div className={`${mobileCurrentView  != MobileScreenCurrentView.DASHBOARD && isMobile && 'hidden'} w-full lg:w-80 border-l h-[calc(100vh-80px)] border-gray-200 dark:border-gray-700 overflow-hidden`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`dashboard-${currentFanId}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <DashboardOverview
                profile={currentFanProfile}
                spendingData={spendingData}
                conversionRate={conversionRate}
                churnRate={churnRate}
                mobileCurrentView={setMobileCurrentView}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
