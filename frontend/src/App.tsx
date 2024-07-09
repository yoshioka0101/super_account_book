import './index.css';
import { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function App() {
  const [totalSpent, setTotalSpent] = useState(0)

  useEffect(() => {
    fetch("/api/expenses/total-spent")
  }, [])

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
  )
}

export default App
