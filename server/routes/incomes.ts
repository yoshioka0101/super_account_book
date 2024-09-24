import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import prisma from '../prismaClient';

const IncomeSchema = z.object({
    id: z.number().int().positive().min(1),
    date: z.string(),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
    tag: z.string().min(1)
})

type Income = z.infer<typeof IncomeSchema>

const createPostSchema = IncomeSchema.omit({ id: true });

export const IncomesRoutes = new Hono()
    .get("/", async (c) => {
        // データベースから全ての経費を取得
        const Incomes = await prisma.Income.findMany();
        return c.json({ Incomes });
    })
    .post("/", zValidator("json", createPostSchema), async (c) => {
        const data = await c.req.valid("json");
        // 新しい経費をデータベースに作成
        const newIncome = await prisma.Income.create({
            data: data,
        });
        return c.json(newIncome);
    })
    .get("/total-spent", async (c) => {
        await new Promise((r) => setTimeout(r, 2000));
        // データベースから全ての経費を取得し、合計を計算
        const Incomes = await prisma.Income.findMany();
        const total = Incomes.reduce((acc, Income) => acc + Income.amount, 0);
        return c.json({ total });
    })
    .get("/:id{[0-9]+}", async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        // 特定の経費をデータベースから取得
        const Income = await prisma.Income.findUnique({
            where: { id },
        });
        if (!Income) {
            return c.notFound();
        }
        return c.json({ Income });
    })
    .delete("/:id{[0-9]+}", async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        try {
            // 特定の経費をデータベースから削除
            const deletedIncome = await prisma.Income.delete({
                where: { id },
            });
            return c.json({ deletedIncome });
        } catch (error) {
            return c.notFound();
        }
    });