import { supabaseAdmin } from '@/lib/supabase/admin';
import { HistoryTable } from '@/components/HistoryTable';
import type { HistoryLog } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HistoricoPage() {
  const { data: logs } = await supabaseAdmin
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

  return (
    <div className="flex flex-col gap-6">
      <HistoryTable logs={(logs || []) as unknown as HistoryLog[]} />
    </div>
  );
}
