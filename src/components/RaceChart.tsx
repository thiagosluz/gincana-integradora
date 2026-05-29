'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { Team, HistoryLog } from '@/types';

type RaceChartProps = {
  teams: Team[];
  logs: HistoryLog[];
};

export function RaceChart({ teams, logs }: RaceChartProps) {
  const chartData = useMemo(() => {
    if (logs.length === 0) return [];

    // Sort logs by date ascending
    const sorted = [...logs].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    // Build cumulative scores per team over time
    const cumulativeScores: Record<string, number> = {};
    teams.forEach(t => { cumulativeScores[t.id] = 0; });

    // Group logs by timestamp (batch scores share the same timestamp)
    const timeGroups: Map<string, typeof sorted> = new Map();
    sorted.forEach(log => {
      const key = log.created_at;
      if (!timeGroups.has(key)) timeGroups.set(key, []);
      timeGroups.get(key)!.push(log);
    });

    // Start point at zero
    const data: Record<string, string | number>[] = [{
      time: 'Início',
      ...Object.fromEntries(teams.map(t => [t.id, 0]))
    }];

    timeGroups.forEach((groupLogs, timestamp) => {
      groupLogs.forEach(log => {
        const teamId = log.teams?.id;
        if (teamId && cumulativeScores[teamId] !== undefined) {
          cumulativeScores[teamId] += log.points;
        }
      });

      const date = new Date(timestamp);
      const label = date.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      data.push({
        time: label,
        ...Object.fromEntries(
          teams.map(t => [t.id, cumulativeScores[t.id] || 0])
        )
      });
    });

    return data;
  }, [teams, logs]);

  if (chartData.length <= 1) {
    return (
      <p className="font-mono text-sm opacity-60 text-center py-8">
        Dados insuficientes para gerar o gráfico.
      </p>
    );
  }

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 justify-center">
        {teams.map(team => (
          <div key={team.id} className="flex items-center gap-1.5">
            <div
              className="w-3 h-3 border border-black"
              style={{ backgroundColor: team.color }}
            />
            <span className="text-xs font-bold uppercase">{team.name}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fontFamily: 'monospace' }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 11, fontFamily: 'monospace' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '2px solid black',
              borderRadius: 0,
              fontFamily: 'monospace',
              fontSize: 12,
            }}
            formatter={(value, name) => {
              const team = teams.find(t => t.id === name);
              return [value, team?.name || name];
            }}
          />
          {teams.map(team => (
            <Line
              key={team.id}
              type="monotone"
              dataKey={team.id}
              stroke={team.color}
              strokeWidth={3}
              dot={{ r: 3, fill: team.color, stroke: '#000', strokeWidth: 1 }}
              activeDot={{ r: 6, stroke: '#000', strokeWidth: 2 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
