import React from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table"
import { toast } from "sonner"
import { Button, IconButton } from "@/components/ui/button"

export const Route = createFileRoute('/incomes')({
  component: Incomes,
})

async function getAllIncomes() {
  const result = await api.incomes.$get()
  const data = await result.json()
  return data
}

async function deleteIncome(id: number) {
  const result = await api.incomes[id].$delete()
  return result
}

// 日付を YYYY-MM-DD 形式に変換する関数
function formatDate(isoDate: string): string {
  return isoDate.split('T')[0]; // 'T' 以降を削除して YYYY-MM-DD を取得
}

function Incomes() {
  const queryClient = useQueryClient()

  const { isLoading, error, data } = useQuery({
    queryKey: ['get-all-incomes'],
    queryFn: getAllIncomes
  })

  const deleteMutation = useMutation({
    mutationFn: deleteIncome,
    onSuccess: () => {
      queryClient.invalidateQueries('get-all-incomes');
      toast('Income Deleted', {
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

  if (!data || !data.incomes) {
    return <div className="p-2">No data available</div>
  }

  return (
    <Table>
      <TableCaption>A list of your recent incomes.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Id</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Tag</TableHead>
          <TableHead>Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.incomes.map((income: { id: number; date: string; title: string; amount: number; tag: string }) => (
          <TableRow key={income.id}>
            <TableCell className="font-medium">{income.id}</TableCell>
            <TableCell>{formatDate(income.date)}</TableCell>
            <TableCell>{income.title}</TableCell>
            <TableCell>{income.amount}</TableCell>
            <TableCell>{income.tag}</TableCell>
            <TableCell>
              <IconButton
                disabled={deleteMutation.isPending}
                onClick={() => handleDelete(income.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">{data.incomes.reduce((total: number, income: { amount: number }) => total + income.amount, 0)}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
