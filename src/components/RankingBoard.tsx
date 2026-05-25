'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase/client';
import type { Team, HistoryLog } from '@/types';
import { Trophy } from 'lucide-react';
import { PublicFeed } from './PublicFeed';

// Arcade counter component
function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const start = displayValue;
    const end = value;
    if (start === end) return;

    const duration = 1000;
    const startTime = performance.now();

    const animate = (time: number) => {
      const progress = Math.min((time - startTime) / duration, 1);
      // easeOutQuart
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeProgress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value, displayValue]);

  return <span className="tabular-nums">{displayValue}</span>;
}

export function RankingBoard({ initialTeams, initialLogs }: { initialTeams: Team[], initialLogs: HistoryLog[] }) {
  const [teams, setTeams] = useState<Team[]>(
    [...initialTeams].sort((a, b) => b.total_score - a.total_score)
  );
  const [logs, setLogs] = useState<HistoryLog[]>(initialLogs || []);
  const [lastUpdate, setLastUpdate] = useState<{ teamId: string; points: number } | null>(null);

  useEffect(() => {
    // Busca a lista atualizada de equipes
    const fetchTeams = async () => {
      const { data } = await supabase.from('teams').select('*').order('total_score', { ascending: false });
      if (data) setTeams(data);
    };

    // Busca a lista atualizada de logs
    const fetchLogs = async () => {
      const { data } = await supabase
        .from('score_logs')
        .select('id, points, created_at, teams (id, name, color), activities (id, name)')
        .order('created_at', { ascending: false });
      if (data) setLogs(data as unknown as HistoryLog[]);
    };

    // Escuta QUALQUER alteração na tabela score_logs (INSERT, UPDATE, DELETE)
    const subscription = supabase
      .channel('public:score_logs')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'score_logs' },
        (payload) => {
          // Se foi uma inserção nova, mostra o balãozinho verde de +pontos
          if (payload.eventType === 'INSERT') {
            const newLog = payload.new as { team_id: string; points: number };
            setLastUpdate({ teamId: newLog.team_id, points: newLog.points });
            setTimeout(() => setLastUpdate(null), 3000);
          }
          
          // Sempre recarrega as equipes para garantir precisão (lida com exclusões e edições também)
          fetchTeams();
          fetchLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4 relative mt-4">
      <div className="flex flex-col items-center mb-6 gap-3">
        <div className="bg-black text-white px-4 py-1.5 border-brutal shadow-brutal transform -rotate-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-center">
            3º Gincana Integradora do IFG Câmpus Jataí
          </h2>
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter text-center border-brutal bg-white p-4 shadow-brutal inline-block transform rotate-1">
          Ranking
        </h1>
      </div>

      <div className="flex flex-col gap-4 relative">
        <AnimatePresence>
          {teams.map((team, index) => {
            const isFirst = index === 0;

            return (
              <motion.div
                key={team.id}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 25,
                  mass: 1,
                }}
                className={`card-brutal overflow-hidden relative flex items-center p-4 ${
                  isFirst ? 'py-8 border-4' : 'py-4 border-2'
                }`}
                style={{ backgroundColor: isFirst ? 'var(--background)' : 'white' }}
              >
                {/* Background Color Block for 1st Place */}
                {isFirst && (
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundColor: team.color }}
                  />
                )}

                {/* Pos */}
                <div className="flex-shrink-0 w-12 font-mono text-3xl font-bold flex items-center justify-center">
                  {isFirst ? (
                    <Trophy className="w-10 h-10" style={{ color: team.color }} strokeWidth={2.5} />
                  ) : (
                    `#${index + 1}`
                  )}
                </div>

                {/* Color Strip Indicator */}
                <div
                  className="w-4 h-full absolute left-0 top-0 border-r-2 border-black"
                  style={{ backgroundColor: team.color }}
                />

                <div className="ml-4 flex-grow z-10">
                  <h2
                    className={`font-bold uppercase tracking-tight ${
                      isFirst ? 'text-3xl' : 'text-xl'
                    }`}
                  >
                    {team.name}
                  </h2>
                </div>

                <div className="flex-shrink-0 flex items-center gap-2 z-10">
                  {lastUpdate?.teamId === team.id && (
                    <motion.span
                      initial={{ opacity: 0, y: 10, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1.1 }}
                      exit={{ opacity: 0 }}
                      className="text-lg font-bold text-green-600 bg-green-100 border-2 border-black px-2 py-0.5 rounded-none font-mono shadow-[2px_2px_0px_0px_#000]"
                    >
                      +{lastUpdate.points}
                    </motion.span>
                  )}
                  <div
                    className={`font-mono font-bold text-right tabular-nums tracking-tighter ${
                      isFirst ? 'text-5xl' : 'text-3xl'
                    }`}
                  >
                    <AnimatedCounter value={team.total_score} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <PublicFeed logs={logs} />
    </div>
  );
}
