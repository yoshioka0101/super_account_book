import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useForm } from '@tanstack/react-form'
import type { FieldApi } from '@tanstack/react-form'
import { api } from '@/lib/api'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/create-expense')({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      title: '',
      amount: 0,
    },
    onSubmit: async ({ value }) => {
      await new Promise( r => setTimeout(r,3000));

      const res = await api.expenses.$post( { json: value } )
      if(!res.ok){
        throw new Error('Server Error')
      }
      console.log(value)

      alert("リダイレクトされます")
      navigate({ to: '/expenses'})
    },
  })

  return (
    <div className="p-2">
      <h2>Create Expense</h2>
      <form
        className='max-w-xl m-auto'
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="mb-4">
          <form.Field name="title">
            {(field: FieldApi<string>) => (
              <>
                <Label htmlFor={field.name}>Title:</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Title"
                />
              </>
            )}
          </form.Field>
        </div>
        <div className="mb-4">
          <form.Field name="amount">
            {(field: FieldApi<number>) => (
              <>
                <Label htmlFor={field.name}>Amount:</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  placeholder="Amount"
                />
              </>
            )}
          </form.Field>
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? '...' : 'Create'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}