import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

type Expense = {
    id: number
    title: string
    amount: number
}

const fakeExpenses: Expense[] = [
    { id: 1, title: "Rent", amount: 1000 },
    { id: 2, title: "Food", amount: 100 },
    { id: 3, title: "Transport", amount: 50 },
]

const createPostSchema = z.object({
    title: z.string().min(3).max(100),
    amount: z.number().int().positive()
})

export const expensesRoutes = new Hono()
    .get("/", (c) => {
        return c.json({ expenses: fakeExpenses })
    })

    .post("/", zValidator("json", createPostSchema), async (c) => {
        const data = await c.req.valid("json");
        const newExpense: Expense = {
            ...data,
            id: fakeExpenses.length + 1
        };
        fakeExpenses.push(newExpense);
        return c.json(newExpense);
    })
    
    .get("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param('id'));
        const expense = fakeExpenses.find(expense => expense.id === id);
        if (!expense) {
            return c.notFound();
        }
        return c.json({ expense });
    })
    
    .delete("/:id{[0-9]+}", (c) => {
        const id = Number.parseInt(c.req.param('id'));
        const index = fakeExpenses.findIndex(expense => expense.id === id);
        if (index === -1) {
            return c.notFound();
        }
        const deletedExpense = fakeExpenses.splice(index, 1)[0];
        return c.json({ deletedExpense });
    });