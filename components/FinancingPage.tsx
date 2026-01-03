
import React, { useState } from 'react';
import { Financing } from '../types';
import { formatCurrency } from '../utils/formatters';

interface FinancingPageProps {
  financings: Financing[];
  addFinancing: (f: Omit<Financing, 'id' | 'payments' | 'createdAt'>) => void;
  selectFinancing: (f: Financing) => void;
}

const FinancingPage: React.FC<FinancingPageProps> = ({ financings, addFinancing, selectFinancing }) => {
  const [description, setDescription] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [totalInstallments, setTotalInstallments] = useState('');
  const [monthlyInstallment, setMonthlyInstallment] = useState('');
  const [dueDay, setDueDay] = useState('10');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !totalValue || !totalInstallments) return;
    addFinancing({
      description,
      totalValue: parseFloat(totalValue),
      totalInstallments: parseInt(totalInstallments),
      monthlyInstallment: monthlyInstallment ? parseFloat(monthlyInstallment) : undefined,
      dueDay: parseInt(dueDay),
    });
    setDescription('');
    setTotalValue('');
    setTotalInstallments('');
    setMonthlyInstallment('');
    setDueDay('10');
    setShowForm(false);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-zinc-400">Financiamentos</h2>
          <p className="text-zinc-500">Controle de bens financiados e amortizações.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-zinc-200 transition-all active:scale-95"
        >
          {showForm ? 'Fechar' : '+ Novo Financiamento'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top duration-300">
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Objeto Financiado</label>
            <input 
              type="text" 
              required
              placeholder="Ex: Apartamento, Carro..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 px-5 outline-none focus:border-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Valor Total (R$)</label>
            <input 
              type="number" 
              required
              placeholder="0,00"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 px-5 outline-none focus:border-zinc-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Nº de Parcelas</label>
            <input 
              type="number" 
              required
              placeholder="Ex: 360"
              value={totalInstallments}
              onChange={(e) => setTotalInstallments(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 px-5 outline-none focus:border-zinc-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Parcela Mensal</label>
              <input 
                type="number" 
                placeholder="0,00"
                value={monthlyInstallment}
                onChange={(e) => setMonthlyInstallment(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 px-5 outline-none focus:border-zinc-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-zinc-500 uppercase font-bold ml-1">Dia do Vencimento</label>
              <input 
                type="number" 
                min="1" max="31"
                required
                value={dueDay}
                onChange={(e) => setDueDay(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 px-5 outline-none focus:border-zinc-500"
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <button 
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl transition-all shadow-lg"
            >
              CADASTRAR FINANCIAMENTO
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {financings.length === 0 ? (
          <div className="col-span-full py-24 text-center text-zinc-600 border-2 border-dashed border-zinc-900 rounded-3xl">
            <p className="text-4xl mb-4">🏠</p>
            <p>Nenhum financiamento cadastrado.</p>
          </div>
        ) : (
          financings.map((f) => {
            const paidValue = f.payments.reduce((acc, curr) => acc + curr.value, 0);
            const remainingValue = f.totalValue - paidValue;
            const paidInstallments = f.payments.reduce((acc, curr) => acc + curr.installmentsDeducted, 0);
            const remainingInstallments = f.totalInstallments - paidInstallments;

            return (
              <div 
                key={f.id} 
                onClick={() => selectFinancing(f)}
                className="group bg-zinc-950 border border-zinc-900 p-7 rounded-3xl cursor-pointer hover:border-zinc-600 transition-all hover:-translate-y-1"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-white text-zinc-100">{f.description}</h3>
                    <p className="text-xs text-zinc-500">Vence todo dia {f.dueDay}</p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-full font-bold uppercase">Ativo</span>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Valor Total</p>
                      <p className="text-lg font-semibold">{formatCurrency(f.totalValue)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">Saldo devedor</p>
                      <p className="text-lg font-bold text-rose-400">{formatCurrency(remainingValue)}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-zinc-900">
                    <div className="flex justify-between mb-2">
                       <p className="text-[10px] text-zinc-500 uppercase">Progresso de Quitação</p>
                       <p className="text-[10px] font-bold text-zinc-300">{paidInstallments} / {f.totalInstallments} parcelas</p>
                    </div>
                    <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                       <div 
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000" 
                        style={{ width: `${(paidInstallments / f.totalInstallments) * 100}%` }}
                       />
                    </div>
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

export default FinancingPage;
