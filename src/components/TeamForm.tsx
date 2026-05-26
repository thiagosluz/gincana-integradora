'use client';

import { useState } from 'react';
import { manageTeam } from '@/app/actions';
import type { Team } from '@/types';

export function TeamForm({ teams }: { teams: Team[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const res = await manageTeam(formData);

    if (res.success) {
      setSuccess(editingTeam ? 'Equipe atualizada com sucesso!' : 'Equipe cadastrada!');
      setEditingTeam(null);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(res.error || 'Erro ao salvar equipe');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-8 max-w-2xl w-full">
      <div className="card-brutal p-6">
        <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
          <h2 className="text-2xl font-bold uppercase">{editingTeam ? 'Editar Equipe' : 'Nova Equipe'}</h2>
          {editingTeam && (
            <button onClick={() => setEditingTeam(null)} className="text-sm underline font-bold cursor-pointer hover:text-red-500">
              Cancelar
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="action" value={editingTeam ? 'update' : 'create'} />
          {editingTeam && <input type="hidden" name="id" value={editingTeam.id} />}
          
          <div className="flex flex-col gap-2">
            <label className="font-bold uppercase text-sm">Nome da Equipe</label>
            <input
              type="text"
              name="name"
              required
              defaultValue={editingTeam?.name || ''}
              placeholder="Ex: Vermelha"
              className="border-brutal p-3 font-mono bg-white focus:outline-none w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold uppercase text-sm">Homenageada (Opcional)</label>
            <input
              type="text"
              name="honoree_name"
              defaultValue={editingTeam?.honoree_name || ''}
              placeholder="Ex: Marta Silva"
              className="border-brutal p-3 font-mono bg-white focus:outline-none w-full"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-bold uppercase text-sm">Cor (HEX)</label>
            <div className="flex gap-2">
              <input
                type="color"
                name="color"
                required
                defaultValue={editingTeam?.color || '#000000'}
                className="border-brutal p-1 h-12 w-20 bg-white cursor-pointer"
              />
              <p className="text-sm font-mono self-center opacity-70">Escolha a cor que representará a equipe no ranking.</p>
            </div>
          </div>

          {error && <p className="text-red-500 font-bold bg-red-100 p-2 border-2 border-red-500">{error}</p>}
          {success && <p className="text-green-600 font-bold bg-green-100 p-2 border-2 border-green-600">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="border-brutal bg-black text-white p-3 font-bold uppercase mt-2 hover:bg-zinc-800 transition-colors shadow-brutal active:translate-y-1 active:shadow-none cursor-pointer"
          >
            {loading ? 'Salvando...' : 'Salvar Equipe'}
          </button>
        </form>
      </div>

      <div className="card-brutal p-6 bg-blue-50">
        <h2 className="text-xl font-bold uppercase mb-4">Equipes Cadastradas</h2>
        {teams.length === 0 ? (
          <p className="opacity-70 font-mono">Nenhuma equipe cadastrada.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {teams.map(team => (
              <li key={team.id} className="border-brutal bg-white p-3 font-bold flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 border-brutal" style={{ backgroundColor: team.color }}></div>
                  <span className="uppercase">{team.name}</span>
                </div>
                <button 
                  onClick={() => {
                    setEditingTeam(team);
                    setSuccess('');
                    setError('');
                  }} 
                  className="text-sm underline cursor-pointer hover:text-blue-500"
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
