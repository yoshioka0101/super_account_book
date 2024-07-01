import { Hono } from 'hono'

type Expense = {
    id: number
    title: string
    amount: number
}

const fakeExpenses: Expense[] = [
    {id: 1,  title: "Rent", amount: 1000 },
    {id: 2,  title: "Food", amount: 100 },
    {id: 3,  title: "Transport", amount: 50 },

]

export const expensesRoutes = new Hono()
    .get("/",(c) => {
        return c.json({ expenses: []})
    })

    .post("/",async(c) => {
        const expense = await c.req.json()
        console.log(expense)
        return c.json(expense)
    })