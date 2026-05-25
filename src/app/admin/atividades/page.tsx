import { supabaseAdmin } from '@/lib/supabase/admin';
import { ActivityForm } from '@/components/ActivityForm';
import type { Activity } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AtividadesPage() {
  const { data: activities } = await supabaseAdmin
    .from('activities')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col gap-6">
      <ActivityForm activities={(activities || []) as Activity[]} />
    </div>
  );
}
