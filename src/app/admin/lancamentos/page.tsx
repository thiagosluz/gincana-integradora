import { supabaseAdmin } from '@/lib/supabase/admin';
import { BatchScoreForm } from '@/components/BatchScoreForm';
import type { Team, Activity } from '@/types';

export const dynamic = 'force-dynamic';

export default async function LancamentosPage() {
  const { data: teams } = await supabaseAdmin
    .from('teams')
    .select('*')
    .order('name');

  const { data: activities } = await supabaseAdmin
    .from('activities')
    .select('*')
    .order('name');

  return (
    <div className="flex flex-col gap-6">
      <BatchScoreForm 
        teams={(teams || []) as Team[]} 
        activities={(activities || []) as Activity[]} 
      />
    </div>
  );
}
