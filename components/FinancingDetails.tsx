
import React, { useState } from 'react';
import { Financing, FinancingPayment } from '../types';
import { formatCurrency, months, years } from '../utils/formatters';

interface FinancingDetailsProps {
  financing: Financing;
  onBack: () => void;
  addPayment: (financingId: string, payment: Omit<FinancingPayment, 'id' | 'createdAt'>) => void;
  deletePayment: (financingId: string, paymentId: string) => void;
}

const FinancingDetails: React.FC<FinancingDetailsProps> = ({ financing, onBack, addPayment, deletePayment }) => {
  const [value, setValue] = useState(financing.monthlyInstallment?.toString() || '');
  const [installmentsDeducted, setInstallmentsDeducted] = useState('1');
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  const totalPaid = financing.payments.reduce((acc, curr) => acc + curr.value, 0);
  const remainingValue = financing.totalValue - totalPaid;
  const installmentsPaid = financing.payments.reduce((acc, curr) => acc + curr.installmentsDeducted, 0);
  const remainingInstallments = financing.totalInstallments - installmentsPaid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value || !installmentsDeducted) return;
    addPayment(financing.id, {
      value: parseFloat(value),
      installmentsDeducted: parseInt(installmentsDeducted),
      month,
      year
    });
    // Reset values but keep month/year for batch entries if needed
    setValue(financing.monthlyInstallment?.toString() || '');
    setInstallmentsDeducted('1');
  };

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="text-3xl font-bold">{financing.description}</h2>
          <p className="text-zinc-500">Detalhes do contrato e histórico de pagamentos.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs uppercase mb-1">Total Já Pago</p>
          <p className="text-2xl font-bold text-zinc-100">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs uppercase mb-1">Valor Restante</p>
          <p className="text-2xl font-bold text-rose-500">{formatCurrency(remainingValue)}</p>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-500 text-xs uppercase mb-1">Parcelas Restantes</p>
          <p className="text-2xl font-bold text-zinc-400">{remainingInstallments} de {financing.totalInstallments}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl sticky top-24">
            <h3 className="text-lg font-bold mb-6">Novo Lançamento</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase ml-1">Valor Pago (R$)</label>
                <input 
                  type="number" 
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-4 outline-none focus:border-zinc-400"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-zinc-500 uppercase ml-1">Parcelas Abatidas</label>
                <input 
                  type="number" 
                  value={installmentsDeducted}
                  onChange={(e) => setInstallmentsDeducted(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-4 outline-none focus:border-zinc-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase ml-1">Mês</label>
                  <select 
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 outline-none cursor-pointer"
                  >
                    {months.map((m, idx) => <option key={m} value={idx}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-500 uppercase ml-1">Ano</label>
                  <select 
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 outline-none cursor-pointer"
                  >
                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <button 
                type="submit"
                className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-zinc-200 transition-colors mt-2"
              >
                Registrar Pagamento
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
             <div className="p-6 border-b border-zinc-900">
               <h3 className="text-lg font-bold">Histórico de Pagamentos</h3>
             </div>
             <table className="w-full text-left">
               <thead className="bg-zinc-900">
                 <tr>
                   <th className="px-6 py-3 text-xs text-zinc-500 uppercase">Referência</th>
                   <th className="px-6 py-3 text-xs text-zinc-500 uppercase text-center">Parcelas</th>
                   <th className="px-6 py-3 text-xs text-zinc-500 uppercase text-right">Valor</th>
                   <th className="px-6 py-3 text-xs text-zinc-500 uppercase text-center w-20">Ações</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-zinc-900">
                 {financing.payments.length === 0 ? (
                   <tr>
                     <td colSpan={4} className="px-6 py-12 text-center text-zinc-600">Nenhum pagamento registrado.</td>
                   </tr>
                 ) : (
                   [...financing.payments].sort((a, b) => (b.year * 12 + b.month) - (a.year * 12 + a.month)).map((p) => (
                     <tr key={p.id} className="hover:bg-zinc-900/40">
                       <td className="px-6 py-4 font-medium text-zinc-300">{months[p.month]} de {p.year}</td>
                       <td className="px-6 py-4 text-center text-zinc-400">{p.installmentsDeducted} parcelas</td>
                       <td className="px-6 py-4 text-right font-bold">{formatCurrency(p.value)}</td>
                       <td className="px-6 py-4 text-center">
                         <button 
                           onClick={() => deletePayment(financing.id, p.id)}
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
      </div>
    </div>
  );
};

export default FinancingDetails;
