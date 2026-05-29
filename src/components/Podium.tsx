'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';
import type { Team } from '@/types';

type PodiumProps = {
  teams: Team[];
  finalMessage: string;
};

export function Podium({ teams, finalMessage }: PodiumProps) {
  useEffect(() => {
    // Dispara confetes de vários ângulos
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: teams.map(t => t.color)
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: teams.map(t => t.color)
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [teams]);

  // Pegamos apenas as top 4 equipes
  const top4 = teams.slice(0, 4);

  // Mapeamento visual das posições no grid flex (2º, 1º, 3º, 4º)
  const renderPodiumBlock = (team: Team, position: number, heightClass: string, delay: number) => {
    return (
      <motion.div
        key={team.id}
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay, type: 'spring', bounce: 0.4 }}
        className="flex flex-col items-center justify-end z-10"
      >
        <div className="flex flex-col items-center mb-2 text-center relative">
          {position === 1 && (
            <motion.div
              animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-2 absolute -top-16 z-20"
            >
              <Trophy size={56} strokeWidth={2.5} style={{ color: team.color, fill: team.color, fillOpacity: 0.4 }} />
            </motion.div>
          )}
          {team.honoree_name && (
            <span className="font-black uppercase text-[9px] md:text-lg break-words w-[72px] md:w-32 line-clamp-2 leading-tight bg-white/80 p-1 rounded-sm shadow-sm backdrop-blur-sm">
              {team.honoree_name}
            </span>
          )}
          <span className="font-mono font-black mt-1 text-[10px] md:text-xl px-1 md:px-2 py-0.5 bg-black text-white transform -rotate-2">
            {team.total_score} pts
          </span>
        </div>

        <div
          className={`${heightClass} w-[72px] md:w-32 border-2 md:border-4 border-black relative overflow-hidden flex flex-col items-center justify-start pt-2 md:pt-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}
          style={{ backgroundColor: team.color }}
        >
          {/* Número da posição grandão */}
          <span className="text-3xl md:text-7xl font-black text-black/40 font-mono select-none drop-shadow-md">
            {position}º
          </span>
        </div>
      </motion.div>
    );
  };

  const firstPlaceColor = top4[0]?.color || '#facc15';

  return (
    <div className="w-full flex flex-col items-center pt-2 pb-8 px-2 md:py-8 md:px-4 overflow-hidden relative">

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.6, delay: 0.2 }}
        className="bg-black text-white px-8 py-4 border-4 transform -rotate-2 mb-8 md:mb-16 z-20"
        style={{ borderColor: firstPlaceColor, boxShadow: `6px 6px 0px 0px ${firstPlaceColor}` }}
      >
        <h1 
          className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-center"
          style={{ color: firstPlaceColor }}
        >
          Grande Campeã
        </h1>
      </motion.div>

      <div className="flex items-end justify-center gap-1 md:gap-4 w-full h-[400px] mb-8 mt-12 md:mt-24 px-1">
        {/* Ordem de renderização para o visual: 2º (esq), 1º (centro), 3º (dir), 4º (extrema dir/baixo) */}
        {top4[1] && renderPodiumBlock(top4[1], 2, 'h-48 md:h-56', 1.0)}
        {top4[0] && renderPodiumBlock(top4[0], 1, 'h-64 md:h-80', 1.5)}
        {top4[2] && renderPodiumBlock(top4[2], 3, 'h-32 md:h-40', 0.5)}
        {top4[3] && renderPodiumBlock(top4[3], 4, 'h-16 md:h-24', 0.2)}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="card-brutal bg-white p-6 md:p-8 max-w-2xl text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-8 relative z-20 border-4 border-black"
      >
        <h2 className="text-xl md:text-3xl font-black uppercase whitespace-pre-wrap leading-tight">
          {finalMessage}
        </h2>
      </motion.div>
    </div>
  );
}
