import { format } from 'date-fns';

export function formatMonth(date: Date): string {
  return format(date, 'yyyy-MM');
}

export function filterExpensesByMonth(expenses: any[], month: string): any[] {
  return expenses.filter(expense => expense.date.startsWith(month));
}
