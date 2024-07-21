import React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/expenses')({
  component: Expenses,
})

async function getAllExpenses() {
  const result = await api.expenses["total-spent"].$get()
  const data = await result.json()
  return data
}

function Expenses() {
  const { isPending, error, data } = useQuery({
    queryKey: ['get-all-expenses'],
    queryFn: getAllExpenses
  })

  return (
    <div className="p-2">
      {isPending ? "..." : JSON.stringify(data, null, 2)}
    </div>
  )
}