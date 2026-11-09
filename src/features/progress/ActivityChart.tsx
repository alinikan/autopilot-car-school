import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Progress } from '../../domain/learning.mjs';
import { shiftDay, today } from '../../domain/learning.mjs';
export default function ActivityChart({ progress }: { progress: Progress }) {
  const days = Array.from({ length: 14 }, (_, i) => {
    const date = shiftDay(today(), i - 13);
    const sessions = progress.activity.filter((a) => a.date === date);
    return {
      date,
      label: new Intl.DateTimeFormat('en-CA', {
        month: 'short',
        day: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(date + 'T12:00Z')),
      xp: sessions.reduce((n, a) => n + a.xp, 0),
      sessions: sessions.length,
    };
  });
  const total = days.reduce((n, d) => n + d.xp, 0);
  return (
    <section className="activity-panel">
      <div className="section-row">
        <div>
          <span className="eyebrow">Last 14 days</span>
          <h2>Learning activity</h2>
        </div>
        <span className="activity-total">
          <b>{total}</b> XP earned
        </span>
      </div>
      <div
        className="activity-chart"
        role="img"
        aria-label={`Learning activity over the last 14 days: ${total} XP across ${days.reduce((n, d) => n + d.sessions, 0)} sessions.`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={days}
            margin={{ top: 20, right: 4, bottom: 4, left: -24 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} stroke="#edf0f3" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              minTickGap={35}
              tick={{ fill: '#687180', fontSize: 11 }}
              dy={10}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#687180', fontSize: 11 }}
            />
            <Tooltip
              cursor={{ fill: '#f1f4ff' }}
              contentStyle={{
                border: '1px solid #e4e7ec',
                borderRadius: 8,
                fontSize: 12,
                boxShadow: '0 8px 24px #12182610',
              }}
              formatter={(value) => [`${value} XP`, 'Learning']}
            />
            <Bar
              dataKey="xp"
              fill="#3b5bdb"
              radius={[4, 4, 0, 0]}
              maxBarSize={26}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {total === 0 && (
        <p className="chart-empty">Your completed lessons and reviews will appear here.</p>
      )}
    </section>
  );
}
