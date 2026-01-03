
import React, { useState } from 'react';
import { Income } from '../types';
import { formatCurrency, months, years } from '../utils/formatters';

interface IncomePageProps {
  incomes: Income[];
  addIncome: (income: Omit<Income, 'id' | 'createdAt'>) => void;
  deleteIncome: (id: string) => void;
  filterMonth: number;
  filterYear: number;
}

const IncomePage: React.FC<IncomePageProps> = ({ incomes, addIncome, deleteIncome, filterMonth, filterYear }) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [type, setType] = useState('Salário');

  const filteredIncomes = incomes.filter(i => i.month === filterMonth && i.year === filterYear);
  const totalMonth = filteredIncomes.reduce((acc, curr) => acc + curr.value, 0);
  const totalYear = incomes.filter(i => i.year === filterYear).reduce((acc, curr) => acc + curr.value, 0);
  const totalAccumulated = incomes.reduce((acc, curr) => acc + curr.value, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !value) return;
    addIncome({
      description,
      value: parseFloat(value),
      type,
      month: filterMonth,
      year: filterYear,
    });
    setDescription('');
    setValue('');
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-emerald-400">Entradas</h2>
          <p className="text-zinc-400">Registre suas receitas e rendimentos de {months[filterMonth]}/{filterYear}.</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
           <div className="text-right">
             <p className="text-xs text-zinc-500 uppercase tracking-wider">No Mês</p>
             <p className="text-lg font-bold">{formatCurrency(totalMonth)}</p>
           </div>
           <div className="text-right">
             <p className="text-xs text-zinc-500 uppercase tracking-wider">No Ano</p>
             <p className="text-lg font-bold">{formatCurrency(totalYear)}</p>
           </div>
           <div className="text-right">
             <p className="text-xs text-zinc-500 uppercase tracking-wider">Acumulado</p>
             <p className="text-lg font-bold text-emerald-400">{formatCurrency(totalAccumulated)}</p>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full space-y-2">
          <label className="text-xs text-zinc-500 uppercase ml-1">Descrição</label>
          <input 
            type="text" 
            placeholder="Ex: Salário Mensal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="w-full md:w-48 space-y-2">
          <label className="text-xs text-zinc-500 uppercase ml-1">Valor (R$)</label>
          <input 
            type="number" 
            step="0.01"
            placeholder="0,00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="w-full md:w-48 space-y-2">
          <label className="text-xs text-zinc-500 uppercase ml-1">Tipo</label>
          <select 
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-3 px-4 outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
          >
            <option>Salário</option>
            <option>Benefício</option>
            <option>Rendimento</option>
            <option>Extra</option>
          </select>
        </div>
        <button 
          type="submit"
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Adicionar
        </button>
      </form>

      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-900 border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase">Descrição</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase">Tipo</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase text-right">Valor</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase text-center w-20">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {filteredIncomes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-zinc-600">Nenhuma entrada registrada para este mês.</td>
              </tr>
            ) : (
              filteredIncomes.map((income) => (
                <tr key={income.id} className="hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{income.description}</td>
                  <td className="px-6 py-4 text-zinc-400">{income.type}</td>
                  <td className="px-6 py-4 text-right text-emerald-400 font-bold">{formatCurrency(income.value)}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => deleteIncome(income.id)}
                      className="text-zinc-600 hover:text-rose-500 transition-colors"
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

export default IncomePage;
