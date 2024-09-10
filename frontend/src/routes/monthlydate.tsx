import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/monthlydate')({
  component: () => <div>Hello /monthlydate!</div>
})

