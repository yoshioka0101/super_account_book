import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import prisma from '../prismaClient';

const IncomeSchema = z.object({
    id: z.number().int().positive().min(1),
    date: z.string(),
    title: z.string().min(3).max(100),
    amount: z.number().int().positive(),
    tag: z.string().min(1)
});

type Income = z.infer<typeof IncomeSchema>;

const createPostSchema = IncomeSchema.omit({ id: true });

export const incomesRoutes = new Hono()
    .get("/", async (c) => {
        const incomes = await prisma.income.findMany(); // 小文字で `income` に注意
        return c.json({ incomes });
    })
    .post("/", zValidator("json", createPostSchema), async (c) => {
        const data = await c.req.valid("json");
        const newIncome = await prisma.income.create({ data });
        return c.json(newIncome);
    })
    .get("/total-income", async (c) => {
        const incomes = await prisma.income.findMany();
        const total = incomes.reduce((acc, income) => acc + income.amount, 0);
        return c.json({ total });
    })
    .get("/:id{[0-9]+}", async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        const income = await prisma.income.findUnique({ where: { id } });
        if (!income) {
            return c.notFound();
        }
        return c.json({ income });
    })
    .delete("/:id{[0-9]+}", async (c) => {
        const id = Number.parseInt(c.req.param('id'));
        try {
            const deletedIncome = await prisma.income.delete({ where: { id } });
            return c.json({ deletedIncome });
        } catch (error) {
            return c.notFound();
        }
    });