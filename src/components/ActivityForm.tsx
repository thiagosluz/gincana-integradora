'use client';

import { useState } from 'react';
import { manageActivity } from '@/app/actions';
import type { Activity } from '@/types';

export function ActivityForm({ activities }: { activities: Activity[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const res = await manageActivity(formData);

    if (res.success) {
      setSuccess('Atividade cadastrada com sucesso!');
      (e.target as HTMLFormElement).reset();
    } else {
      setError(res.error || 'Erro ao salvar atividade');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl w-full">
      <div className="card-brutal p-6">
        <h2 className="text-2xl font-bold uppercase border-b-4 border-black pb-4 mb-6">Nova Atividade</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="action" value="create" />
          
          <div className="flex flex-col gap-2">
            <label className="font-bold uppercase text-sm">Nome da Atividade</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Ex: Arrecadação de Alimentos"
              className="border-brutal p-3 font-mono bg-white focus:outline-none w-full"
            />
          </div>

          {error && <p className="text-red-500 font-bold bg-red-100 p-2 border-2 border-red-500">{error}</p>}
          {success && <p className="text-green-600 font-bold bg-green-100 p-2 border-2 border-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="border-brutal bg-black text-white p-3 font-bold uppercase mt-2 hover:bg-zinc-800 transition-colors shadow-brutal active:translate-y-1 active:shadow-none cursor-pointer"
          >
            {loading ? 'Salvando...' : 'Cadastrar Atividade'}
          </button>
        </form>
      </div>

      <div className="card-brutal p-6 bg-yellow-50">
        <h2 className="text-xl font-bold uppercase mb-4">Atividades Cadastradas</h2>
        {activities.length === 0 ? (
          <p className="opacity-70 font-mono">Nenhuma atividade cadastrada.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {activities.map(act => (
              <li key={act.id} className="border-brutal bg-white p-3 font-bold flex justify-between items-center">
                <span>{act.name}</span>
                {/* Aqui poderíamos ter botão de deletar ou editar futuramente se necessário */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
