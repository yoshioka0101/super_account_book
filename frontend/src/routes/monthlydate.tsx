import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const Route = createFileRoute('/monthlydate')({
  component: MonthlyDate
});

function MonthlyDate() {
  // 月の状態を保持する
  const [currentlyMonth, setCurrentlyMonth] = useState(new Date());
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  
  const formattedMonth = format(currentlyMonth, 'yyyy-MM');

  useEffect(() => {
    async function fetchExpenses() {
      const result = await api.expenses.$get();
      const data = await result.json();
      setExpenses(data.expenses);
    }
    
    fetchExpenses();
  }, []);
  
  useEffect(() => {
    if (expenses.length > 0) {
      const filtered = expenses.filter(expense => expense.date.startsWith(formattedMonth));
      setFilteredExpenses(filtered);
    }
  }, [expenses, formattedMonth]);

  return (
    <div>
      <h2>月のデータを表示</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Id</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Tag</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* フィルタリングされた経費データを表示 */}
          {filteredExpenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.id}</TableCell>
              <TableCell>{expense.date.split('T')[0]}</TableCell>
              <TableCell>{expense.title}</TableCell>
              <TableCell>{expense.amount}</TableCell>
              <TableCell>{expense.tag}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
