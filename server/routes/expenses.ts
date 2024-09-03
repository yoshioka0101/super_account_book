import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import prisma from '../prismaClient';

const expenseSchema = z.object({
    id: z.number().int().positive().min(1),
    date: z.string(),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
    tag: z.string().min(1)
})

type Expense = z.infer<typeof expenseSchema>

const createPostSchema = expenseSchema.omit({ id: true });

export const expensesRoutes = new Hono()
    .get("/", async (c) => {
        // データベースから全ての経費を取得
        const expenses = await prisma.expense.findMany();
        return c.json({ expenses });
    })
    .post("/", zValidator("json", createPostSchema), async (c) => {
        const data = await c.req.valid("json");
        // 新しい経費をデータベースに作成
        const newExpense = await prisma.expense.create({
            data: data,
        });
        return c.json(newExpense);
    })
    .get("/total-spent", async (c) => {
        await new Promise((r) => setTimeout(r, 2000));
        // データベースから全ての経費を取得し、合計を計算
        const expenses = await prisma.expense.findMany();
        const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);
        return c.json({ total });
    })
    .get("/:id{[0-9]+}", async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        // 特定の経費をデータベースから取得
        const expense = await prisma.expense.findUnique({
            where: { id },
        });
        if (!expense) {
            return c.notFound();
        }
        return c.json({ expense });
    })
    .delete("/:id{[0-9]+}", async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        try {
            // 特定の経費をデータベースから削除
            const deletedExpense = await prisma.expense.delete({
                where: { id },
            });
            return c.json({ deletedExpense });
        } catch (error) {
            return c.notFound();
        }
    });