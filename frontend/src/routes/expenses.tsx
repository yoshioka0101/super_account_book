import React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { Button, IconButton } from "@/components/ui/button"

export const Route = createFileRoute('/expenses')({
  component: Expenses,
})

async function getAllExpenses() {
  const result = await api.expenses.$get()
  const data = await result.json()
  return data
}

async function deleteExpense(id: number) {
  const result = await api.expenses[id].$delete()
  return result
}

function Expenses() {
  const queryClient = useQueryClient()

  const { isLoading, error, data } = useQuery({
    queryKey: ['get-all-expenses'],
    queryFn: getAllExpenses
  })

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries('get-all-expenses');
      toast('Expense Deleted', {
        description: '削除が成功しました',
      });
    },
    onError: () => {
      toast('Error', {
        description: '削除できませんでした',
      })
    },
  })

  const handleDelete = (id: number) => {
    if (confirm('本当に削除しますか？')) {
      deleteMutation.mutate(id);
    }
  }

  if (isLoading) {
    return <div className="p-2">Loading...</div>
  }

  if (error) {
    return <div className="p-2">Error: {error.message}</div>
  }

  if (!data || !data.expenses) {
    return <div className="p-2">No data available</div>
  }

  return (
    <Table>
      <TableCaption>A list of your recent expenses.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Tag</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.expenses.map((expense: { id: number; title: string; amount: number; tag: string }) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.id}</TableCell>
            <TableCell>{expense.title}</TableCell>
            <TableCell>{expense.amount}</TableCell>
            <TableCell>{expense.tag}</TableCell>
            <TableCell>
              <IconButton
                disabled={deleteMutation.isPending}
                onClick={() => handleDelete(expense.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{data.expenses.reduce((total: number, expense: { amount: number }) => total + expense.amount, 0)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
