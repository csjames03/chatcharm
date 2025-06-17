import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import dayjs from 'dayjs';
import { MobileScreenCurrentView } from '../App';
import { ChevronLeft } from 'lucide-react';
export interface FanProfile {
  name: string
  imageUrl: string
  subscribedSince: string  // e.g. 'Aug 2023'
}

export interface SpendingPoint {
  day: string 
  amount: number
}

export interface DashboardOverviewProps {
  profile: FanProfile
  spendingData: SpendingPoint[]
  conversionRate: number    // 0.14 for 14%
  churnRate: number         // 0.012 for 1.2%
  mobileCurrentView: (view:MobileScreenCurrentView) => void;
}

export default function DashboardOverview({
  profile,
  spendingData,
  conversionRate,
  churnRate,
  mobileCurrentView
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      {/* ─── Fan Profile ───────────────────────────────────── */}
      
      <div className="
        flex items-center
        bg-white dark:bg-gray-800
        rounded-lg shadow
        transition-colors
        pt-6 gap-2
      ">
        <div className='lg:hidden ' aria-label="Go back" onClick={() => {
          mobileCurrentView?.(MobileScreenCurrentView.CHAT)
        }}>
          <ChevronLeft className="text-gray-700 dark:text-gray-300" size={34} />
      </div>
        <img
          src={profile.imageUrl}
          alt={profile.name}
          className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
        />
        <div className="ml-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {profile.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Subscribed since {dayjs(profile.subscribedSince).format('MMMM YYYY')}
          </p>
        </div>
      </div>

      {/* ─── Spending History ───────────────────────────────── */}
      <div className="
        bg-white dark:bg-gray-800
        p-6 rounded-lg shadow
        transition-colors
      ">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Spending History
        </h3>
        <div style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendingData}>
              {/* hide axis lines, just labels */}
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                contentStyle={{
                  background: '#1F2937',
                  border: 'none',
                  borderRadius: 6,
                  color: '#fff',
                }}
              />
              <Bar dataKey="amount" radius={[4,4,0,0]}>
                {spendingData.map((_, idx) => (
                  <Cell
                    key={idx}
                    fill={idx === spendingData.length - 1 ? '#3B82F6' : '#6366F1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Conversion Metrics ─────────────────────────────── */}
      <div className="
        bg-white dark:bg-gray-800
        p-6 rounded-lg shadow
        transition-colors
      ">
        <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
          Conversion Metrics
        </h3>

        {/* Conversion Rate */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 dark:text-gray-400">Conversion Rate</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {(conversionRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded">
            <div
              className="h-1 bg-green-500 rounded"
              style={{ width: `${conversionRate * 100}%` }}
            />
          </div>
        </div>

        {/* Churn Rate */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-500 dark:text-gray-400">Churn Rate</span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {(churnRate * 100).toFixed(1)}%
            </span>
          </div>
          <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded">
            <div
              className="h-1 bg-blue-500 rounded"
              style={{ width: `${churnRate * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
