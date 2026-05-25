'use client';

import { useState } from 'react';
import { login } from '@/app/actions';

export function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await login(password);
    if (!res.success) {
      setError(res.error || 'Erro no login');
      setLoading(false);
    }
    // If success, the cookie is set and the server component will re-render automatically 
    // because we call revalidatePath inside or the layout will just re-read the cookie on refresh.
    // Wait, Server Actions redirect or mutate. We should refresh the page to let the layout see the cookie.
    if (res.success) {
      window.location.reload();
    }
  };

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
