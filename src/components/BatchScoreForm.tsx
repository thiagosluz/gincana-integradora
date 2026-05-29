'use client';

import { useState } from 'react';
import { addBatchScores } from '@/app/actions';
import type { Team, Activity } from '@/types';

export function BatchScoreForm({ teams, activities }: { teams: Team[], activities: Activity[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const res = await addBatchScores(formData);

    if (res.success) {
      setSuccess('Pontos lançados com sucesso para todas as equipes!');
      (e.target as HTMLFormElement).reset();
    } else {
      setError(res.error || 'Erro ao lançar pontos');
    }
    setLoading(false);
  };

  return (
    <div className="card-brutal p-6 max-w-2xl w-full">
      <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
        <h2 className="text-2xl font-bold uppercase">Lançamento em Lote</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase text-sm">Selecione a Atividade</label>
          <select 
            name="activityId" 
            required 
            className="border-brutal p-3 font-bold bg-white focus:outline-none appearance-none rounded-none"
          >
            <option value="">-- Selecione --</option>
            {activities.map((act) => (
              <option key={act.id} value={act.id}>
                {act.name}
              </option>
            ))}
          </select>
          {activities.length === 0 && (
             <p className="text-red-500 text-xs font-bold mt-1">Nenhuma atividade cadastrada. Vá em &quot;Atividades&quot; e crie uma.</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase text-sm">Motivo / Observação <span className="font-normal opacity-50">(opcional)</span></label>
          <input
            type="text"
            name="description"
            placeholder="Ex: Penalidade por atraso, Bonificação especial..."
            className="border-brutal p-3 bg-white focus:outline-none"
          />
        </div>

        <div className="border-t-2 border-black pt-6 flex flex-col gap-4">
          <h3 className="font-black uppercase text-lg">Pontuação por Equipe</h3>
          <p className="text-sm opacity-70 mb-2">Digite os pontos que cada equipe ganhou nesta atividade. Deixe 0 se não pontuou.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map((team) => (
              <div key={team.id} className="flex flex-col gap-1">
                <label className="font-bold uppercase text-xs" style={{ color: team.color }}>
                  {team.name}
                </label>
                <div className="flex items-center">
                  <span className="border-brutal border-r-0 bg-zinc-100 p-2 font-bold">+</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="^-?[0-9]+(,[0-9]+)?$"
                    title="Use apenas vírgula para decimais (ex: 2,5)"
                    name={`points_${team.id}`}
                    defaultValue="0"
                    required
                    className="border-brutal p-2 font-mono text-lg bg-white focus:outline-none w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 font-bold bg-red-100 p-2 border-2 border-red-500">{error}</p>}
        {success && <p className="text-green-600 font-bold bg-green-100 p-2 border-2 border-green-600">{success}</p>}

        <button
          type="submit"
          disabled={loading || activities.length === 0}
          className="border-brutal bg-black text-white p-4 font-bold uppercase text-lg mt-4 hover:bg-zinc-800 transition-colors shadow-brutal active:translate-y-1 active:shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : 'Confirmar Lançamentos'}
        </button>
      </form>
    </div>
  );
}
