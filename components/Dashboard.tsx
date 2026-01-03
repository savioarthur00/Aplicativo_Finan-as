
import React from 'react';
import { AppData } from '../types';
import { formatCurrency, months, years } from '../utils/formatters';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface DashboardProps {
  data: AppData;
  filterMonth: number;
  filterYear: number;
  setFilterMonth: (m: number) => void;
  setFilterYear: (y: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, filterMonth, filterYear, setFilterMonth, setFilterYear }) => {
  const monthlyIncomes = data.incomes.filter(i => i.month === filterMonth && i.year === filterYear);
  const monthlyExpenses = data.expenses.filter(e => e.month === filterMonth && e.year === filterYear);
  
  const totalIncomeMonth = monthlyIncomes.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpenseMonth = monthlyExpenses.reduce((acc, curr) => acc + curr.value, 0);
  const resultMonth = totalIncomeMonth - totalExpenseMonth;

  const totalIncomesAll = data.incomes.reduce((acc, curr) => acc + curr.value, 0);
  const totalExpensesAll = data.expenses.reduce((acc, curr) => acc + curr.value, 0);
  const accumulatedResult = totalIncomesAll - totalExpensesAll;

  const totalInvested = data.investments.reduce((acc, inv) => 
    acc + inv.contributions.reduce((cAcc, c) => cAcc + c.value, 0), 0
  );

  // Goal logic updated to percentage
  const currentGoal = data.goals.find(g => g.month === filterMonth && g.year === filterYear);
  const currentPercentage = totalIncomeMonth > 0 ? (totalExpenseMonth / totalIncomeMonth) * 100 : 0;

  const getPercentageStatus = (pct: number) => {
    if (pct <= 0 && totalExpenseMonth === 0) return { label: 'Sem Gastos', color: 'text-zinc-500', bg: 'bg-zinc-500/10' };
    if (totalIncomeMonth === 0 && totalExpenseMonth > 0) return { label: 'ATITUDES DEVEM SER TOMADAS', color: 'text-rose-600 animate-pulse', bg: 'bg-rose-600/20' };
    if (pct <= 50) return { label: '50% - Ideal', color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
    if (pct <= 60) return { label: '60% - Aceitável', color: 'text-green-400', bg: 'bg-green-400/10' };
    if (pct <= 70) return { label: '70% - Justo', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    if (pct <= 80) return { label: '80% - Preocupante', color: 'text-orange-400', bg: 'bg-orange-400/10' };
    if (pct <= 90) return { label: '90% - Muito Preocupante', color: 'text-rose-400', bg: 'bg-rose-400/10' };
    if (pct <= 95) return { label: '95% - Risco Grave', color: 'text-rose-500', bg: 'bg-rose-500/10' };
    if (pct <= 100) return { label: '100% - Inaceitável', color: 'text-rose-600', bg: 'bg-rose-600/10' };
    return { label: '>100% - ATITUDES DEVEM SER TOMADAS', color: 'text-rose-600 animate-pulse font-black', bg: 'bg-rose-600/20' };
  };

  const status = getPercentageStatus(currentPercentage);

  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(filterYear, filterMonth - i, 1);
    return { month: d.getMonth(), year: d.getFullYear() };
  }).reverse();

  const chartData = last6Months.map(m => {
    const inc = data.incomes.filter(i => i.month === m.month && i.year === m.year).reduce((a, c) => a + c.value, 0);
    const exp = data.expenses.filter(e => e.month === m.month && e.year === m.year).reduce((a, c) => a + c.value, 0);
    return {
      name: `${months[m.month].substring(0, 3)}`,
      receitas: inc,
      despesas: exp,
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-zinc-400">Status financeiro de {months[filterMonth]} de {filterYear}.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800">
          <select 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(Number(e.target.value))}
            className="bg-transparent text-sm py-1 px-3 border-none outline-none focus:ring-0 cursor-pointer text-zinc-300"
          >
            {months.map((m, idx) => <option key={m} value={idx} className="bg-zinc-950">{m}</option>)}
          </select>
          <select 
            value={filterYear} 
            onChange={(e) => setFilterYear(Number(e.target.value))}
            className="bg-transparent text-sm py-1 px-3 border-none outline-none focus:ring-0 cursor-pointer text-zinc-300"
          >
            {years.map(y => <option key={y} value={y} className="bg-zinc-950">{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Entradas (Mês)</p>
          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totalIncomeMonth)}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Saídas (Mês)</p>
          <p className="text-2xl font-bold text-rose-500">{formatCurrency(totalExpenseMonth)}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Investimentos</p>
          <p className="text-2xl font-bold text-cyan-400">{formatCurrency(totalInvested)}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Resultado</p>
          <p className={`text-2xl font-bold ${resultMonth >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
            {formatCurrency(resultMonth)}
          </p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-500 text-[10px] font-bold uppercase mb-2">Saldo Geral</p>
          <p className={`text-2xl font-bold ${accumulatedResult >= 0 ? 'text-zinc-100' : 'text-rose-500'}`}>
            {formatCurrency(accumulatedResult)}
          </p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span className="text-2xl">🎯</span> Saúde Orçamentária
          </h3>
          <span className={`px-4 py-1.5 rounded-full text-xs font-black border uppercase ${status.bg} ${status.color}`}>
            {status.label}
          </span>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 italic">Ocupação da Renda pelas Despesas</span>
            <span className={`font-black ${status.color}`}>{currentPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden p-1">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ${currentPercentage > 100 ? 'bg-rose-600 animate-pulse' : 'bg-emerald-500'}`}
              style={{ width: `${Math.min(100, currentPercentage)}%` }}
            />
          </div>
          {currentGoal && (
            <div className="flex justify-between text-[10px] text-zinc-600 uppercase font-bold px-1">
              <span>0%</span>
              <span>Sua Meta: {currentGoal.targetPercentage}%</span>
              <span>100%+</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-2xl">
          <h3 className="text-lg font-bold mb-8">Evolução Financeira</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: '#18181b' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
                <Bar dataKey="receitas" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="despesas" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-2xl">
          <h3 className="text-lg font-bold mb-4">Dicas do FinancePro</h3>
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <p className="text-sm text-zinc-300">💡 {currentPercentage > 70 ? 'Cuidado! Suas despesas estão consumindo uma fatia grande da sua renda. Considere revisar seus gastos variáveis.' : 'Parabéns! Suas finanças estão saudáveis. Considere aumentar seus investimentos este mês.'}</p>
            </div>
            <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <p className="text-sm text-zinc-300">🏦 Mantenha sua aba de investimentos atualizada para ver seu patrimônio crescer.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
