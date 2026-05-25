'use client';

import { useState } from 'react';
import { login, logout, addScore } from '@/app/actions';
import type { Team } from '@/types';

export function AdminPanel({ isLogged, teams }: { isLogged: boolean; teams: Team[] }) {
  const [logged, setLogged] = useState(isLogged);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await login(password);
    if (res.success) {
      setLogged(true);
    } else {
      setError(res.error || 'Erro no login');
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await logout();
    setLogged(false);
  };

  const handleSubmitScore = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData(e.currentTarget);
    const res = await addScore(formData);

    if (res.success) {
      setSuccess('Pontos adicionados com sucesso!');
      (e.target as HTMLFormElement).reset();
    } else {
      setError(res.error || 'Erro ao adicionar pontos');
    }
    setLoading(false);
  };

  if (!logged) {
    return (
      <div className="card-brutal p-8 max-w-sm w-full mx-auto mt-20">
        <h2 className="text-2xl font-bold uppercase mb-6 text-center">Acesso Admin</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-brutal p-3 font-mono focus:outline-none focus:ring-0 w-full bg-white"
          />
          {error && <p className="text-red-500 font-bold font-mono">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="border-brutal bg-black text-white p-3 font-bold uppercase hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="card-brutal p-6 max-w-lg w-full mx-auto mt-12 mb-12">
      <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
        <h2 className="text-2xl font-bold uppercase">Lançar Pontos</h2>
        <button onClick={handleLogout} className="font-bold underline uppercase text-sm hover:text-red-500 cursor-pointer">
          Sair
        </button>
      </div>

      <form onSubmit={handleSubmitScore} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase text-sm">Equipe</label>
          <select 
            name="teamId" 
            required 
            className="border-brutal p-3 font-bold bg-white focus:outline-none appearance-none rounded-none"
          >
            <option value="">Selecione uma equipe...</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase text-sm">Atividade / Descrição</label>
          <input
            type="text"
            name="description"
            required
            placeholder="Ex: Arrecadação de alimentos"
            className="border-brutal p-3 bg-white focus:outline-none rounded-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-bold uppercase text-sm">Pontos</label>
          <input
            type="number"
            name="points"
            required
            placeholder="Ex: 50"
            className="border-brutal p-3 font-mono text-xl bg-white focus:outline-none rounded-none"
          />
        </div>

        {error && <p className="text-red-500 font-bold bg-red-100 p-2 border-2 border-red-500">{error}</p>}
        {success && <p className="text-green-600 font-bold bg-green-100 p-2 border-2 border-green-600">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="border-brutal bg-black text-white p-4 font-bold uppercase text-lg mt-4 hover:bg-zinc-800 transition-colors shadow-brutal active:translate-y-1 active:shadow-none cursor-pointer"
        >
          {loading ? 'Salvando...' : 'Confirmar Lançamento'}
        </button>
      </form>
    </div>
  );
}
