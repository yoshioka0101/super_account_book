import { Hono } from 'hono'

const app = new Hono()

app.get("/test", c => {
    return c.json({"message": "test"})
} )

export default app // for Cloudflare Workers or Bun