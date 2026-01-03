
import React, { useState } from 'react';
import { Investment, InvestmentContribution } from '../types';
import { formatCurrency } from '../utils/formatters';

interface InvestmentsPageProps {
  investments: Investment[];
  addInvestment: (inv: Omit<Investment, 'id' | 'contributions' | 'createdAt'>) => void;
  addContribution: (invId: string, contribution: Omit<InvestmentContribution, 'id' | 'createdAt'>) => void;
  deleteInvestment: (id: string) => void;
  deleteContribution: (invId: string, contribId: string) => void;
}

const InvestmentsPage: React.FC<InvestmentsPageProps> = ({ 
  investments, addInvestment, addContribution, deleteInvestment, deleteContribution 
}) => {
  const [showAddInv, setShowAddInv] = useState(false);
  const [selectedInvId, setSelectedInvId] = useState<string | null>(null);

  // New Investment Form States
  const [desc, setDesc] = useState('');
  const [type, setType] = useState<'Renda Fixa' | 'Renda Variável'>('Renda Fixa');

  // New Contribution Form States
  const [value, setValue] = useState('');
  const [source, setSource] = useState('Salário');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc) return;
    addInvestment({ description: desc, type });
    setDesc('');
    setShowAddInv(false);
  };

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvId || !value || !date) return;
    addContribution(selectedInvId, {
      value: parseFloat(value),
      source,
      date
    });
    setValue('');
    setSelectedInvId(null);
  };

  const grandTotal = investments.reduce((acc, inv) => 
    acc + inv.contributions.reduce((cAcc, c) => cAcc + c.value, 0), 0
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-cyan-400">Patrimônio Investido</h2>
          <p className="text-zinc-500">Gestão de ativos e aportes mensais.</p>
        </div>
        <div className="flex flex-col items-end">
          <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Total Consolidado</p>
          <div className="bg-cyan-500/10 border border-cyan-500/20 px-6 py-2 rounded-2xl">
            <p className="text-3xl font-black text-white">{formatCurrency(grandTotal)}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => { setShowAddInv(!showAddInv); setSelectedInvId(null); }}
          className="bg-white text-black font-black px-8 py-3 rounded-2xl hover:bg-zinc-200 transition-all flex items-center gap-2"
        >
          {showAddInv ? 'Fechar Form' : '+ Novo Ativo'}
        </button>
      </div>

      {showAddInv && (
        <form onSubmit={handleAddInvestment} className="bg-zinc-950 border border-zinc-900 p-8 rounded-[2.5rem] animate-in slide-in-from-top duration-300">
          <h3 className="text-lg font-bold mb-6">Cadastrar Novo Investimento</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Descrição do Ativo</label>
              <input 
                type="text" required placeholder="Ex: CDB Banco X, Ação PETR4..."
                value={desc} onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Tipo de Renda</label>
              <select 
                value={type} onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none cursor-pointer focus:border-cyan-500"
              >
                <option value="Renda Fixa">Renda Fixa</option>
                <option value="Renda Variável">Renda Variável</option>
              </select>
            </div>
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white font-black py-3 rounded-xl transition-all">
              CADASTRAR ATIVO
            </button>
          </div>
        </form>
      )}

      {selectedInvId && (
        <form onSubmit={handleAddContribution} className="bg-zinc-950 border border-cyan-500/30 p-8 rounded-[2.5rem] animate-in slide-in-from-top duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Adicionar Aporte para: <span className="text-cyan-400">{investments.find(i => i.id === selectedInvId)?.description}</span></h3>
            <button type="button" onClick={() => setSelectedInvId(null)} className="text-zinc-500 hover:text-white">Cancelar</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Valor do Aporte (R$)</label>
              <input 
                type="number" required step="0.01"
                value={value} onChange={(e) => setValue(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Fonte</label>
              <select 
                value={source} onChange={(e) => setSource(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-cyan-500"
              >
                <option>Salário</option>
                <option>Bônus</option>
                <option>Dividendos</option>
                <option>Extra</option>
                <option>Reserva</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Data</label>
              <input 
                type="date" required
                value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-cyan-500"
              />
            </div>
            <button type="submit" className="bg-white text-black font-black py-3 rounded-xl transition-all">
              CONFIRMAR APORTE
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {investments.length === 0 ? (
          <div className="col-span-full py-32 text-center text-zinc-700 border-2 border-dashed border-zinc-900 rounded-[3rem]">
            <p className="text-4xl mb-4">📉</p>
            <p className="font-medium">Nenhum investimento cadastrado. Comece a construir seu futuro hoje.</p>
          </div>
        ) : (
          investments.map(inv => {
            const totalInv = inv.contributions.reduce((a, c) => a + c.value, 0);
            return (
              <div key={inv.id} className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] overflow-hidden flex flex-col">
                <div className="p-8 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border mb-2 inline-block ${inv.type === 'Renda Fixa' ? 'text-blue-400 border-blue-400/20' : 'text-purple-400 border-purple-400/20'}`}>
                        {inv.type}
                      </span>
                      <h4 className="text-2xl font-black text-white">{inv.description}</h4>
                    </div>
                    <button 
                      onClick={() => deleteInvestment(inv.id)}
                      className="text-zinc-800 hover:text-rose-500 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Total Acumulado</p>
                      <p className="text-3xl font-black text-zinc-100">{formatCurrency(totalInv)}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedInvId(inv.id)}
                      className="text-cyan-400 font-black text-xs hover:underline uppercase tracking-widest"
                    >
                      + Adicionar Aporte
                    </button>
                  </div>
                </div>

                <div className="bg-zinc-900/50 p-6 border-t border-zinc-900 flex-1">
                  <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-4">Histórico de Aportes</p>
                  <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {inv.contributions.length === 0 ? (
                      <p className="text-zinc-700 italic text-xs">Sem aportes registrados.</p>
                    ) : (
                      [...inv.contributions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(c => (
                        <div key={c.id} className="flex justify-between items-center bg-zinc-900 p-3 rounded-xl border border-zinc-800">
                          <div>
                            <p className="text-xs font-bold text-zinc-200">{new Date(c.date).toLocaleDateString('pt-BR')}</p>
                            <p className="text-[10px] text-zinc-500 uppercase">{c.source}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-zinc-100">{formatCurrency(c.value)}</span>
                            <button 
                              onClick={() => deleteContribution(inv.id, c.id)}
                              className="text-zinc-700 hover:text-rose-500"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default InvestmentsPage;
