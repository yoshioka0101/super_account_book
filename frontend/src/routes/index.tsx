import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { format, addMonths } from 'date-fns';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { formatMonth, filterExpensesByMonth, filterIncomesByMonth } from '@/utils/format';
import { initialTags, getTags, selectTag } from '@/utils/tag';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label";

export const Route = createFileRoute('/')({
  component: Index
});

async function getTotalSpent() {
  const result = await api.expenses["total-spent"].$get();
  const data = await result.json();
  return data;
}

async function getTotalIncome() {
  const result = await api.incomes["total-income"].$get();
  const data = await result.json();
  return data;
}

function Index() {
  const { isPending: isPendingSpent, error: errorSpent, data: dataSpent } = useQuery({ queryKey: ['get-total-spent'], queryFn: getTotalSpent });
  const { isPending: isPendingIncome, error: errorIncome, data: dataIncome } = useQuery({ queryKey: ['get-total-income'], queryFn: getTotalIncome });

  const [currentlyMonth, setCurrentlyMonth] = useState(new Date());
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);
  const [incomes, setIncomes] = useState<any[]>([]);
  const [filteredIncomes, setFilteredIncomes] = useState<any[]>([]);
  
  const formattedMonth = formatMonth(currentlyMonth);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');

  // 月別の支出/収入を表示する
  const [monthlyExpenses, setMonthlyExpenses] = useState<{ [key: string]: number }>({});
  const [monthlyIncomes, setMonthlyIncomes] = useState<{ [key: string]: number }>({});

  // 合計を計算する
  const totalExpenses = Object.values(monthlyExpenses).reduce((sum, value) => sum + value, 0);
  const totalIncomes = Object.values(monthlyIncomes).reduce((sum, value) => sum + value, 0);

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const result = await api.expenses.$get();
        const data = await result.json();
        setExpenses(data.expenses);
      } catch (error) {
        console.error("Error fetching expenses", error);
      }
    }

    async function fetchIncomes() {
      try {
        const result = await api.incomes.$get();
        const data = await result.json();
        setIncomes(data.incomes);
      } catch (error) {
        console.error("Error fetching incomes", error);
      }
    }

    fetchExpenses();
    fetchIncomes();
  }, [formattedMonth]);

  useEffect(() => {
    setTags(getTags());
  }, []);

  useEffect(() => {
    let monthFilteredExpenses = filterExpensesByMonth(expenses, formattedMonth);
    let monthFilteredIncomes = filterIncomesByMonth(incomes, formattedMonth);
    setFilteredExpenses(selectTag(monthFilteredExpenses, selectedTag)); // タグでフィルタリング
    setFilteredIncomes(selectTag(monthFilteredIncomes, selectedTag)); // タグでフィルタリング
  }, [expenses, incomes, currentlyMonth, selectedTag]);

  const handlePreviousMonth = () => {
    setCurrentlyMonth(addMonths(currentlyMonth, -1));
  };

  const handleNextMonth = () => {
    setCurrentlyMonth(addMonths(currentlyMonth, +1));
  };

  useEffect(() => {
    const savedTags = JSON.parse(localStorage.getItem('expenseTags') || '[]');
    setTags([...initialTags, ...savedTags]); 
  }, []);

  return (
    <>
      <div className="flex justify-center space-x-4">
        <Card className="w-[350px] mb-8">
          <CardHeader>
            <CardTitle>合計支出</CardTitle>
            <CardDescription>あなたの合計支出金額</CardDescription>
          </CardHeader>
          <CardContent>{isPendingSpent ? "Loading..." : errorSpent ? "Error fetching total spent" : dataSpent?.total}</CardContent>
          <CardFooter></CardFooter>
        </Card>

        <Card className="w-[350px] mb-8">
          <CardHeader>
            <CardTitle>合計収入</CardTitle>
            <CardDescription>あなたの合計収入金額</CardDescription>
          </CardHeader>
          <CardContent>{isPendingIncome ? "Loading..." : errorIncome ? "Error fetching total income" : dataIncome?.total}</CardContent>
          <CardFooter></CardFooter>
        </Card>
      </div>

      <CardFooter className="flex justify-center items-center gap-4">
        <Button onClick={handlePreviousMonth}>前月</Button>
        <h2>{formattedMonth}</h2>
        <Button onClick={handleNextMonth}>次月</Button>
      </CardFooter>

      <CardFooter className="flex justify-center items-center gap-4">
        <div className="mb-4">
          <Label htmlFor="tag-select">Tag:</Label>
          <select
            id="tag-select"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option value="">すべて</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </CardFooter>

      <Card className="w-[800px] m-auto mt-8">
        <CardHeader>
          <CardTitle>月別支出</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map(expense => (
                  <TableRow key={expense.id}>
                    <TableCell>{expense.id}</TableCell>
                    <TableCell>{expense.date.split('T')[0]}</TableCell>
                    <TableCell>{expense.title}</TableCell>
                    <TableCell>{expense.amount}</TableCell>
                    <TableCell>{expense.tag}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">その月のデータはありません</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="w-[800px] m-auto mt-8">
        <CardHeader>
          <CardTitle>月別収入</CardTitle>
        </CardHeader>
        <CardContent>
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
              {filteredIncomes.length > 0 ? (
                filteredIncomes.map(income => (
                  <TableRow key={income.id}>
                    <TableCell>{income.id}</TableCell>
                    <TableCell>{income.date.split('T')[0]}</TableCell>
                    <TableCell>{income.title}</TableCell>
                    <TableCell>{income.amount}</TableCell>
                    <TableCell>{income.tag}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">その月のデータはありません</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
