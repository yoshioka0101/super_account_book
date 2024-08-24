import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
    tag: z.string().min(1)
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true })

// サンプルデータを追加
let fakeExpenses: Expense[] = [
  { id: 1, title: 'Groceries', amount: 50, tag: 'tag1' },
  { id: 2, title: 'Utilities', amount: 100, tag: 'tag2' },
  { id: 3, title: 'Rent', amount: 800, tag: 'tag3' },
];

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
    .get("/total-spent",async (c) => {
        await new Promise((r) => setTimeout(r,2000))
        const total = fakeExpenses.reduce((acc, expense) => acc + expense.amount, 0);
        return c.json({ total });
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