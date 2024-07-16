import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { expensesRoutes } from './frontend/src/routes/expenses'
import { serveStatic } from 'hono/bun'


const app = new Hono()

app.use(logger())

app.get("/test", c => {
    return c.json({"message": "test"})
} )

const apiRoutes = app.basePath("/api").route("/expenses", expensesRoutes)

app.use('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

export default app // for Cloudflare Workers or Bun
export type ApiRoutes = typeof apiRoutes