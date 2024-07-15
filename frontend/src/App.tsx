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

import { hc } from 'hono/client';
import { type ApiRoutes } from "../../server/app";

const client = hc<ApiRoutes>('/');

function App() {
  const [totalSpent, setTotalSpent] = useState(0);

  useEffect(() => {
    async function fetchTotal() {
      try {
        const res = await client.api.expenses("total-spent").$get();
        const data = await res.json();
        setTotalSpent(data.total);
      } catch (error) {
        console.error("Error fetching total spent:", error);
      }
    }
    fetchTotal();
  }, []);

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Total Spent</CardTitle>
        <CardDescription>the total amount you are spent</CardDescription>
      </CardHeader>
      <CardContent>{totalSpent}</CardContent>
      <CardFooter>
      </CardFooter>
    </Card>
  );
}

export default App;