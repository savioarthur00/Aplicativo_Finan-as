
import React, { useState } from 'react';
import { Goal } from '../types';
import { months, years } from '../utils/formatters';

interface GoalsPageProps {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  deleteGoal: (id: string) => void;
  currentMonth: number;
  currentYear: number;
}

const GoalsPage: React.FC<GoalsPageProps> = ({ goals, addGoal, deleteGoal, currentMonth, currentYear }) => {
  const [targetPercentage, setTargetPercentage] = useState('60');
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPercentage) return;
    addGoal({
      month,
      year,
      targetPercentage: parseFloat(targetPercentage)
    });
  };

  const getLabelForPercentage = (pct: number) => {
    if (pct <= 50) return 'Ideal';
    if (pct <= 60) return 'Aceitável';
    if (pct <= 70) return 'Justo';
    if (pct <= 80) return 'Preocupante';
    if (pct <= 90) return 'Muito Preocupante';
    if (pct <= 95) return 'Risco Grave';
    return 'Inaceitável';
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div>
        <h2 className="text-3xl font-bold">🎯 Planejamento de Metas</h2>
        <p className="text-zinc-400">Defina qual percentual da sua renda você pretende comprometer.</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <h3 className="text-xl font-bold">Definir Nova Meta</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Mês</label>
                  <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-zinc-500 text-sm">
                    {months.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Ano</label>
                  <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 px-4 outline-none focus:border-zinc-500 text-sm">
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Percentual Alvo (%)</label>
                <div className="flex gap-4 items-center">
                  <input 
                    type="range" 
                    min="30" max="100" step="5"
                    value={targetPercentage}
                    onChange={(e) => setTargetPercentage(e.target.value)}
                    className="flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <span className="w-16 text-center bg-zinc-900 border border-zinc-800 py-2 rounded-lg font-black text-emerald-400">
                    {targetPercentage}%
                  </span>
                </div>
                <p className="text-[10px] text-zinc-600 italic">Esta é a porcentagem máxima da sua renda que você deseja gastar.</p>
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/10"
              >
                SALVAR META DO MÊS
              </button>
            </form>
          </div>

          <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-3xl space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Escala de Referência</h4>
            <div className="space-y-2">
              {[
                { p: '50%', l: 'Ideal', c: 'bg-emerald-500' },
                { p: '60%', l: 'Aceitável', c: 'bg-green-500' },
                { p: '70%', l: 'Justo', c: 'bg-yellow-500' },
                { p: '80%', l: 'Preocupante', c: 'bg-orange-500' },
                { p: '90%', l: 'Muito Preocupante', c: 'bg-rose-500' },
                { p: '95%', l: 'Risco Grave', c: 'bg-red-600' },
                { p: '100%', l: 'Inaceitável', c: 'bg-red-800' },
              ].map(item => (
                <div key={item.p} className="flex items-center gap-3 text-sm">
                  <div className={`w-3 h-3 rounded-full ${item.c}`}></div>
                  <span className="font-bold w-12 text-zinc-400">{item.p}</span>
                  <span className="text-zinc-500">—</span>
                  <span className="text-zinc-300">{item.l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-900/50">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-wider">Mês/Ano</th>
              <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Percentual Alvo</th>
              <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Classificação</th>
              <th className="px-8 py-5 text-xs font-bold text-zinc-500 uppercase tracking-wider text-center w-20">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {goals.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-8 py-16 text-center text-zinc-600 italic">Nenhuma meta personalizada definida.</td>
              </tr>
            ) : (
              [...goals].sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month)).map((goal) => (
                <tr key={goal.id} className="hover:bg-zinc-900/30 transition-colors">
                  <td className="px-8 py-5 font-bold text-zinc-200">{months[goal.month]} de {goal.year}</td>
                  <td className="px-8 py-5 text-right text-emerald-400 font-black">{goal.targetPercentage}%</td>
                  <td className="px-8 py-5 text-right text-zinc-500 font-medium">
                    {getLabelForPercentage(goal.targetPercentage)}
                  </td>
                  <td className="px-8 py-5 text-center">
                    <button 
                      onClick={() => deleteGoal(goal.id)}
                      className="text-zinc-700 hover:text-rose-500 transition-colors"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoalsPage;
