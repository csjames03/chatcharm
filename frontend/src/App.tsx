
import ConversationList from './components/ConversationList'
import NavigationBar from './components/NavigationBar'
import ChatScreen from './components/ChatScreen'
import DashboardOverview, { FanProfile, SpendingPoint } from './components/DashBoardOverview'

const profile: FanProfile = {
  name: 'Stephanie Powell',
  imageUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
  subscribedSince: 'Aug 2023',
}

const spendingData: SpendingPoint[] = [
  { day: 'M', amount: 5 },
  { day: 'T', amount: 8 },
  { day: 'W', amount: 12 },
  { day: 'T', amount: 20 },
  { day: 'F', amount: 32 },
  { day: 'S', amount: 40 },
  { day: 'S', amount: 56 },
]


interface Message {
  id: string
  text: string
  type: 'sent' | 'received'
  timestamp: Date
}

const dummyMessages: Message[] = [
  {
    id: '1',
    text: 'Are you planning to go live again soon?',
    type: 'received',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2h ago
  },
  {
    id: '2',
    text: "Yes, I'll be streaming tomorrow evening!",
    type: 'sent',
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1h ago
  },
  {
    id: '3',
    text: 'Great, looking forward to it!',
    type: 'received',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30m ago
  },
]

const quickReplies = [
  'Join me for a live stream',
  'Check out my latest post!',
]



export default function App() {
  return (
    <div className="font-mono w-screen h-screen bg-white dark:bg-zinc-900">
      <NavigationBar />

      {/* 3-column layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left sidebar */}
        <div className="w-80 border-r border-gray-200 dark:border-gray-700">
          <ConversationList />
        </div>

        {/* Main chat */}
        <div className="flex-1">
          <ChatScreen
            title="Stephanie Powell"
            initialMessages={dummyMessages}
            quickReplies={quickReplies}
          />
        </div>

        {/* Right sidebar */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-700 px-4 py-6">
          <DashboardOverview
            profile={profile}
            spendingData={spendingData}
            conversionRate={0.143}
            churnRate={0.012}
          />
        </div>
      </div>
    </div>
  )
}
