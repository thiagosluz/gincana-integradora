'use client';

import { useState } from 'react';
import type { HistoryLog } from '@/types';

export function PublicFeed({ logs, kioskMode }: { logs: HistoryLog[], kioskMode?: boolean }) {
  const [showModal, setShowModal] = useState(false);
  
  // Exibe apenas os últimos 5
  const recentLogs = logs.slice(0, 5);

  return (
    <div className="w-full max-w-md mx-auto mt-12 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black uppercase bg-black text-white px-3 py-1 transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
          Últimas Atividades
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {recentLogs.length === 0 ? (
          <p className="font-mono text-sm opacity-60 text-center">Nenhum evento registrado ainda.</p>
        ) : (
          recentLogs.map((log) => (
            <div key={log.id} className="card-brutal bg-white p-3 border-2 border-black flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-brutal flex-shrink-0" style={{ backgroundColor: log.teams?.color || '#000' }}></div>
                <div className="flex flex-col">
                  <span className="font-bold text-sm uppercase leading-tight">{log.teams?.name || 'Deletada'}</span>
                  <span className="font-mono text-xs opacity-70 truncate max-w-[150px]">{log.activities?.name || 'Desconhecida'}</span>
                </div>
              </div>
              <div className="font-black text-xl font-mono">
                {log.points > 0 ? `+${log.points}` : log.points}
              </div>
            </div>
          ))
        )}
      </div>

      {!kioskMode && logs.length > 0 && (
        <button 
          onClick={() => setShowModal(true)}
          className="mt-2 border-brutal bg-[var(--foreground)] text-[var(--background)] p-3 font-bold uppercase hover:bg-zinc-800 transition-colors shadow-brutal active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer"
        >
          🔍 Auditar Histórico Completo
        </button>
      )}

      {/* Modal Ver Tudo */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-brutal p-6 bg-white w-full max-w-2xl max-h-[90vh] flex flex-col gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex justify-between items-center border-b-4 border-black pb-4">
              <h3 className="text-2xl font-black uppercase">Auditoria de Lançamentos</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="font-bold uppercase text-red-600 hover:text-red-800 underline cursor-pointer"
              >
                Fechar [X]
              </button>
            </div>
            
            <div className="overflow-y-auto pr-2 flex-grow">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-black bg-zinc-100 uppercase text-xs">
                    <th className="p-2">Data/Hora</th>
                    <th className="p-2">Equipe</th>
                    <th className="p-2">Atividade</th>
                    <th className="p-2 text-right">Pontos</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-zinc-300 hover:bg-zinc-50">
                      <td className="p-2 font-mono text-xs opacity-80">
                        {new Date(log.created_at).toLocaleString('pt-BR')}
                      </td>
                      <td className="p-2 font-bold uppercase flex items-center gap-2">
                        <span className="w-3 h-3 border border-black block" style={{ backgroundColor: log.teams?.color || '#000' }}></span>
                        {log.teams?.name || 'Deletada'}
                      </td>
                      <td className="p-2 opacity-90">{log.activities?.name || 'Desconhecida'}</td>
                      <td className="p-2 text-right font-mono font-bold">
                        {log.points > 0 ? `+${log.points}` : log.points}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
