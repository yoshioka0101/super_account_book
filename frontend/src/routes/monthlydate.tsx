import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {format} from "date-fns"

export const Route = createFileRoute('/monthlydate')({
  component:MonthlyDate
})

function MonthlyDate() {
  const [currentlyMonth, setCurrentlyMonth] = useState(new Date())
  const formattedDate = format(currentlyMonth,"yyyy-MM")
  console.log(formattedDate)
  return (
    <div>
      <h2>月のデータを表示</h2>
      <p>現在の月: {formattedDate}</p>
    </div>
  )
}

