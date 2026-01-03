
import React, { useState } from 'react';
import { Wish } from '../types';
import { formatCurrency } from '../utils/formatters';

interface WishesPageProps {
  wishes: Wish[];
  addWish: (wish: Omit<Wish, 'id' | 'createdAt'>) => void;
  deleteWish: (id: string) => void;
}

const WishesPage: React.FC<WishesPageProps> = ({ wishes, addWish, deleteWish }) => {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [priority, setPriority] = useState<Wish['priority']>('Média');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !value) return;
    addWish({
      description,
      value: parseFloat(value),
      priority
    });
    setDescription('');
    setValue('');
    setPriority('Média');
  };

  const priorityColors = {
    'Baixa': 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20',
    'Média': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    'Alta': 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  };

  const totalValue = wishes.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold">✨ Lista de Desejos</h2>
          <p className="text-zinc-400">Sonhos e aquisições planejadas para o futuro.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold">Total Estimado</p>
          <p className="text-2xl font-black text-white">{formatCurrency(totalValue)}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl space-y-6">
        <h3 className="text-lg font-bold">Adicionar Novo Desejo</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">O que você deseja?</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Novo Smartphone"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 outline-none focus:border-zinc-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Valor Estimado (R$)</label>
            <input 
              type="number" 
              required
              placeholder="0,00"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-4 outline-none focus:border-zinc-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-500 uppercase font-bold ml-1">Nível de Prioridade</label>
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value as Wish['priority'])}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 px-3 outline-none cursor-pointer focus:border-zinc-500"
            >
              <option value="Baixa">Baixa Prioridade</option>
              <option value="Média">Média Prioridade</option>
              <option value="Alta">Alta Prioridade</option>
            </select>
          </div>
          <button 
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all active:scale-95"
          >
            Adicionar à Lista
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishes.length === 0 ? (
          <div className="col-span-full py-20 text-center text-zinc-700 border-2 border-dashed border-zinc-900 rounded-3xl">
            Sua lista de desejos está vazia. Comece a planejar seus sonhos!
          </div>
        ) : (
          [...wishes].sort((a, b) => {
            const priorityOrder = { 'Alta': 3, 'Média': 2, 'Baixa': 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          }).map((wish) => (
            <div key={wish.id} className="bg-zinc-950 border border-zinc-900 p-6 rounded-3xl flex flex-col justify-between hover:border-zinc-700 transition-colors group">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full border ${priorityColors[wish.priority]}`}>
                    {wish.priority}
                  </span>
                  <button 
                    onClick={() => deleteWish(wish.id)}
                    className="text-zinc-700 hover:text-rose-500 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-zinc-100 mb-1">{wish.description}</h4>
                  <p className="text-2xl font-black text-zinc-400 group-hover:text-white transition-colors">
                    {formatCurrency(wish.value)}
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-600 uppercase font-bold">
                <span>Adicionado em</span>
                <span>{new Date(wish.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WishesPage;
