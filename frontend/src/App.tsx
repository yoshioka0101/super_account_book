import './index.css';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useQuery } from '@tanstack/react-query'

import { hc } from 'hono/client';
import { type ApiRoutes } from "@server/app";
import { api } from './lib/api';

async function getTotalSpent() {
  const result = await api.expenses["total-spent"].$get()
  const data = await result.json()
  return data
}

const client = hc<ApiRoutes>('/');

function App() {

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

export default App;