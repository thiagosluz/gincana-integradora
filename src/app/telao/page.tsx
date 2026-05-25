import { supabaseAdmin } from '@/lib/supabase/admin';
import { RankingBoard } from '@/components/RankingBoard';

// Opt out of caching so the initial load always fetches fresh data from DB
export const revalidate = 0;

export default async function TelaoPage() {
  // Inicializamos o estado com as equipes e a pontuação real
  const { data: teams } = await supabaseAdmin
    .from('teams')
    .select('*')
    .order('total_score', { ascending: false });

  // Inicializamos com as últimas 5 atividades para o feed
  const { data: logs } = await supabaseAdmin
    .from('score_logs')
    .select('id, points, created_at, teams (id, name, color), activities (id, name)')
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <main className="min-h-screen bg-[var(--background)] py-8 font-sans overflow-hidden">
      {/* 
        A prop kioskMode ativa o modo telão: 
        - Esconde o scrollbar principal
        - Esconde o botão de "Auditar Histórico"
        - Aumenta o tamanho da escala do layout
      */}
      <RankingBoard 
        initialTeams={teams || []} 
        initialLogs={(logs as any) || []} 
        kioskMode={true} 
      />
    </main>
  );
}
