'use client';

import { useState } from 'react';
import { deleteScoreLog, updateScoreLog } from '@/app/actions';

type HistoryLog = {
  id: string;
  points: number;
  created_at: string;
  teams: { id: string; name: string; color: string };
  activities: { id: string; name: string };
};

export function HistoryTable({ logs }: { logs: HistoryLog[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('0');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: 'date' | 'activity' | 'team'; direction: 'asc' | 'desc' } | null>(null);

  const sortedLogs = [...logs].sort((a, b) => {
    if (!sortConfig) return 0;
    
    let aVal = '';
    let bVal = '';

    if (sortConfig.key === 'date') {
      aVal = a.created_at;
      bVal = b.created_at;
    } else if (sortConfig.key === 'activity') {
      aVal = a.activities?.name || '';
      bVal = b.activities?.name || '';
    } else if (sortConfig.key === 'team') {
      aVal = a.teams?.name || '';
      bVal = b.teams?.name || '';
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: 'date' | 'activity' | 'team') => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: 'date' | 'activity' | 'team') => {
    if (!sortConfig || sortConfig.key !== key) return <span className="opacity-30 ml-1">↕</span>;
    return sortConfig.direction === 'asc' ? <span className="ml-1">↑</span> : <span className="ml-1">↓</span>;
  };

  const handleDelete = async (id: string) => {
    setDeleteConfirmId(null); // Fecha o modal
    setLoading(id);
    setError('');
    
    const res = await deleteScoreLog(id);
    if (!res.success) setError(res.error || 'Erro ao deletar');
    setLoading(null);
  };

  const handleUpdate = async (id: string) => {
    setLoading(id);
    setError('');

    const formData = new FormData();
    formData.append('id', id);
    formData.append('points', editValue);
    
    const res = await updateScoreLog(formData);
    
    if (res.success) {
      setEditingId(null);
    } else {
      setError(res.error || 'Erro ao atualizar');
    }
    setLoading(null);
  };

  const handleExportCSV = () => {
    const headers = ['Data/Hora', 'Atividade', 'Equipe', 'Pontos'];
    const rows = logs.map(log => [
      new Date(log.created_at).toLocaleString('pt-BR').replace(',', ''),
      `"${log.activities?.name || 'Desconhecida'}"`,
      `"${log.teams?.name || 'Deletada'}"`,
      log.points.toString().replace('.', ',')
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map(e => e.join(';'))
    ].join('\n');

    // Add BOM for Excel UTF-8 compatibility
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historico_gincana_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Modal Brutalista de Confirmação */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-brutal p-8 bg-white max-w-sm w-full transform rotate-1 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black uppercase mb-4 text-red-600 bg-red-100 inline-block px-2 transform -rotate-2">Excluir?</h3>
            <p className="font-bold text-sm mb-8 opacity-80">
              Tem certeza que deseja apagar este lançamento? Os pontos serão subtraídos do ranking da equipe imediatamente.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 border-brutal bg-white text-black p-3 font-bold uppercase hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 border-brutal bg-red-600 text-white p-3 font-bold uppercase hover:bg-red-700 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card-brutal p-6 overflow-x-auto w-full">
        <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
          <h2 className="text-2xl font-bold uppercase">Histórico de Lançamentos</h2>
          <button
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="border-brutal bg-[#eab308] text-black px-4 py-2 font-bold uppercase text-sm hover:bg-[#ca8a04] transition-colors shadow-brutal active:translate-y-1 active:shadow-none cursor-pointer disabled:opacity-50"
          >
            Exportar CSV
          </button>
        </div>
        
        {error && <p className="text-red-500 font-bold bg-red-100 p-2 border-2 border-red-500 mb-4">{error}</p>}

        {logs.length === 0 ? (
          <p className="opacity-70 font-mono">Nenhum lançamento encontrado.</p>
        ) : (
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b-4 border-black bg-zinc-100 uppercase text-xs">
                <th className="p-3 cursor-pointer hover:bg-zinc-200 select-none" onClick={() => handleSort('date')}>Data/Hora {getSortIcon('date')}</th>
                <th className="p-3 cursor-pointer hover:bg-zinc-200 select-none" onClick={() => handleSort('activity')}>Atividade {getSortIcon('activity')}</th>
                <th className="p-3 cursor-pointer hover:bg-zinc-200 select-none" onClick={() => handleSort('team')}>Equipe {getSortIcon('team')}</th>
                <th className="p-3 text-right">Pontos</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedLogs.map((log) => {
                const isEditing = editingId === log.id;
                const isProcessing = loading === log.id;
                
                return (
                  <tr key={log.id} className="border-b-2 border-black hover:bg-zinc-50 transition-colors">
                    <td className="p-3 font-mono text-sm">
                      {new Date(log.created_at).toLocaleString('pt-BR')}
                    </td>
                    <td className="p-3 font-bold text-sm">
                      {log.activities?.name || 'Desconhecida'}
                    </td>
                    <td className="p-3 font-bold uppercase text-sm">
                      <span 
                        className="px-2 py-1 border-brutal text-white" 
                        style={{ backgroundColor: log.teams?.color || '#000' }}
                      >
                        {log.teams?.name || 'Deletada'}
                      </span>
                    </td>
                    <td className="p-3 text-right font-mono text-lg font-bold">
                      {isEditing ? (
                        <input 
                          type="text" 
                          inputMode="decimal"
                          pattern="^-?[0-9]+(,[0-9]+)?$"
                          title="Use apenas vírgula para decimais (ex: 2,5)"
                          value={editValue} 
                          onChange={(e) => setEditValue(e.target.value)}
                          className="border-brutal p-1 w-24 text-right font-mono bg-white"
                        />
                      ) : (
                        log.points > 0 ? `+${log.points.toString().replace('.', ',')}` : log.points.toString().replace('.', ',')
                      )}
                    </td>
                    <td className="p-3 text-right text-sm font-bold underline">
                      {isEditing ? (
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => handleUpdate(log.id)}
                            disabled={isProcessing}
                            className="text-green-600 hover:text-green-800 cursor-pointer"
                          >
                            Salvar
                          </button>
                          <button 
                            type="button" 
                            onClick={() => setEditingId(null)}
                            disabled={isProcessing}
                            className="text-zinc-500 hover:text-black cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-3">
                          <button 
                            onClick={() => {
                              setEditingId(log.id);
                              setEditValue(log.points.toString().replace('.', ','));
                            }}
                            disabled={isProcessing}
                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                          >
                            Editar
                          </button>
                          <button 
                            onClick={() => setDeleteConfirmId(log.id)}
                            disabled={isProcessing}
                            className="text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            {isProcessing ? '...' : 'Excluir'}
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
