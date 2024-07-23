import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'
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

export const Route = createFileRoute('/expenses')({
  component: Expenses,
})

async function getAllExpenses() {
  const result = await api.expenses.$get()
  const data = await result.json()
  return data
}

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-expenses'],
    queryFn: getAllExpenses
  })

  if (isPending) {
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.expenses.map((expense: { id: number; title: string; amount: number }) => (
          <TableRow key={expense.id}>
            <TableCell className="font-medium">{expense.id}</TableCell>
            <TableCell>{expense.title}</TableCell>
            <TableCell>{expense.amount}</TableCell>
            <TableCell className="text-right">{expense.amount}</TableCell>
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
