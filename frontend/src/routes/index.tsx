import { createFileRoute } from '@tanstack/react-router';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useQuery } from '@tanstack/react-query'

import { api } from '@/lib/api';

export const Route = createFileRoute('/')({
  component: Index
})

async function getTotalSpent() {
  const result = await api.expenses["total-spent"].$get()
  const data = await result.json()
  return data
}

function Index() {
  const { isPending,error,data } = useQuery({ queryKey: ['get-total-spent'], queryFn: getTotalSpent })

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>the total amount you are spent</CardDescription>
      </CardHeader>
      <CardContent>{isPending ? "...": data.total}</CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}