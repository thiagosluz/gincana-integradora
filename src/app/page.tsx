import { supabase } from '@/lib/supabase/client';
import { RankingBoard } from '@/components/RankingBoard';
import type { Team, HistoryLog } from '@/types';

// Force dynamic so it doesn't cache the initial render statically forever
export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .select('*')
    .order('total_score', { ascending: false });

  const { data: logs, error: logsError } = await supabase
    .from('score_logs')
    .select(`
      id,
      points,
      description,
      created_at,
      teams (id, name, color),
      activities (id, name)
    `)
    .order('created_at', { ascending: false });

  const { data: settingsData } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  if (teamsError || logsError) {
    console.error('Error fetching data:', teamsError || logsError);
    return (
      <div className="p-8 text-center text-red-500 font-bold font-mono">
        Erro ao carregar o ranking. Verifique as configurações do banco.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] py-4 md:py-12 px-4 flex flex-col items-center">
      <RankingBoard 
        initialTeams={teams as Team[]} 
        initialLogs={logs as unknown as HistoryLog[]} 
        initialSettings={settingsData || null}
      />
    </main>
  );
}
