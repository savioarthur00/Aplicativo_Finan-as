
export interface Income {
  id: string;
  description: string;
  value: number;
  type: string;
  month: number;
  year: number;
  createdAt: number;
}

export interface Expense {
  id: string;
  description: string;
  value: number;
  category: string;
  month: number;
  year: number;
  createdAt: number;
}

export interface FinancingPayment {
  id: string;
  value: number;
  month: number;
  year: number;
  installmentsDeducted: number;
  createdAt: number;
}

export interface Financing {
  id: string;
  description: string;
  totalValue: number;
  totalInstallments: number;
  monthlyInstallment?: number;
  dueDay: number;
  payments: FinancingPayment[];
  createdAt: number;
}

export interface Goal {
  id: string;
  month: number;
  year: number;
  targetPercentage: number; // Goal for max spending percentage
}

export interface InvestmentContribution {
  id: string;
  value: number;
  source: string; // Salário, Bônus, Extra, Dividendos...
  date: string;
  createdAt: number;
}

export interface Investment {
  id: string;
  description: string;
  type: 'Renda Fixa' | 'Renda Variável';
  contributions: InvestmentContribution[];
  createdAt: number;
}

export interface Wish {
  id: string;
  description: string;
  value: number;
  priority: 'Baixa' | 'Média' | 'Alta';
  createdAt: number;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  reminderDay: number;
  budgetAlertThreshold: number;
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export type ViewType = 'DASHBOARD' | 'INCOME' | 'EXPENSE' | 'FINANCING' | 'FINANCING_DETAILS' | 'GOALS' | 'WISHES' | 'INVESTMENTS' | 'SETTINGS';

export interface AppData {
  incomes: Income[];
  expenses: Expense[];
  financings: Financing[];
  goals: Goal[];
  wishes: Wish[];
  investments: Investment[];
  settings: UserSettings;
}
