import { supabaseAdmin } from '@/lib/supabase/admin';
import { toggleGincanaStatus } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function ConfiguracoesPage() {
  const { data: settings } = await supabaseAdmin
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  const isFinalized = settings?.is_finalized || false;
  const finalMessage = settings?.final_message || 'Obrigado a todos pela participação na Gincana!';

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-2">
        Configurações da Gincana
      </h2>

      <div className="card-brutal bg-white p-6 shadow-brutal flex flex-col gap-4">
        <h3 className="text-xl font-bold uppercase">Encerramento</h3>
        
        <p className="text-sm font-medium opacity-80">
          O encerramento altera a tela pública para o &quot;Pódio Épico&quot;, mostrando as top 4 equipes, troféu e disparando confetes na tela do telão. O ranking de pontos atual será congelado na tela final.
        </p>

        <form action={toggleGincanaStatus} className="flex flex-col gap-4 mt-4">
          <input type="hidden" name="is_finalized" value={(!isFinalized).toString()} />
          
          <div className="flex flex-col gap-2">
            <label htmlFor="final_message" className="font-bold uppercase text-sm">
              Mensagem de Agradecimento
            </label>
            <textarea
              id="final_message"
              name="final_message"
              defaultValue={finalMessage}
              rows={3}
              className="border-2 border-black p-2 font-mono text-sm w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] resize-none"
              placeholder="Ex: Valeu galera! Ano que vem tem mais!"
            ></textarea>
          </div>

          <button
            type="submit"
            className={`w-full p-4 text-white font-black uppercase text-xl border-brutal transition-all shadow-brutal active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer mt-4
              ${isFinalized ? 'bg-zinc-800 hover:bg-black' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isFinalized ? '🔓 Reabrir Gincana' : '🏆 Finalizar Gincana e Exibir Pódio'}
          </button>
        </form>

        {isFinalized && (
          <div className="bg-yellow-200 border-2 border-black p-3 text-sm font-bold mt-2">
            ⚠️ A gincana está atualmente finalizada. A tela pública está exibindo o Pódio.
          </div>
        )}
      </div>
    </div>
  );
}
