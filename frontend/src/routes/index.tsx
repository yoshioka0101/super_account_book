import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { format, addMonths } from 'date-fns';
import { api } from '@/lib/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from '@tanstack/react-query';
import { formatMonth, filterExpensesByMonth } from '@/utils/format';
import { selectTag } from '@/utils/tag';
import { Button } from '@/components/ui/button';
import { Label } from "@/components/ui/label"

export const Route = createFileRoute('/')({
  component: Index
});

async function getTotalSpent() {
  const result = await api.expenses["total-spent"].$get();
  const data = await result.json();
  return data;
}

function Index() {
  const { isPending, error, data } = useQuery({ queryKey: ['get-total-spent'], queryFn: getTotalSpent });
  const [currentlyMonth, setCurrentlyMonth] = useState(new Date());
  const [expenses, setExpenses] = useState<any[]>([]);
  const [filteredExpenses, setFilteredExpenses] = useState<any[]>([]);

  const formattedMonth = formatMonth(currentlyMonth);

  const initialTags = ["食費", "交通費", "娯楽費", "光熱費", "固定費", "その他"];
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>('');

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

    fetchExpenses();
  }, [formattedMonth]);

  useEffect(() => {
    let monthFiltered = filterExpensesByMonth(expenses, formattedMonth);
    setFilteredExpenses(selectTag(monthFiltered, selectedTag)); // タグでフィルタリング
  }, [expenses, currentlyMonth, selectedTag]);

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
      <Card className="w-[350px] m-auto mb-8">
        <CardHeader>
          <CardTitle>合計金額</CardTitle>
          <CardDescription>あなたの合計出費金額 </CardDescription>
        </CardHeader>
        <CardContent>{isPending ? "Loading..." : error ? "Error fetching total spent" : data?.total}</CardContent>
        <CardFooter></CardFooter>
      </Card>

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
            <option value="">選択肢</option>
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
        <CardFooter></CardFooter>
      </Card>
    </>
  );
}
