import { supabaseAdmin } from '@/lib/supabase/admin';
import { TeamForm } from '@/components/TeamForm';
import type { Team } from '@/types';

export const dynamic = 'force-dynamic';

export default async function EquipesPage() {
  const { data: teams } = await supabaseAdmin
    .from('teams')
    .select('*')
    .order('name');

  return (
    <div className="flex flex-col gap-6">
      <TeamForm teams={(teams || []) as Team[]} />
    </div>
  );
}
