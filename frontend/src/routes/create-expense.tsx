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
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({})

  //初期データ
  const initialTags = ["食費", "交通費", "娯楽費", "光熱費", "固定費", "その他"];
  const [tags, setTags] = React.useState<string[]>([])

  React.useEffect(() => {
    const savedTags = JSON.parse(localStorage.getItem('expenseTags') || '[]');
    setTags([...initialTags, ...savedTags]);
  }, [])

  const form = useForm({
    defaultValues: {
      date: '',
      title: '',
      amount: 0,
      tag: '',
    },
    onSubmit: async ({ value }) => {
     // エラーメッセージをリセットすることで再入力の時にvalidationが効くようにする
      setFormErrors({});

      // フロントエンド側での簡易バリデーションを追加
      const errors: Record<string, string> = {};
      if (!value.title) {
        errors.title = '必須項目です';
      } else if (value.title.length < 3) {
        errors.title = '3文字以上で入力してください';
      }

      if (value.amount <= 0) {
        errors.amount = '1円以上で入力してください';
      }

      if (!value.date) {
        errors.date = '日付を選択してください';
      }

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return;
      }

      // サーバーサイドバリデーション
      const res = await api.expenses.$post({ json: value })
      if (!res.ok) {
        const errorData = await res.json();
        if (res.status === 400 && errorData.error) {
          const errors = errorData.error.reduce((acc: Record<string, string>, err: any) => {
            acc[err.path[0]] = err.message;
            return acc;
          }, {});
          setFormErrors(errors);
          return;
        } else {
          throw new Error('Server Error');
        }
      }

      navigate({ to: '/expenses' })
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
                {formErrors.title && <p className="text-red-500">{formErrors.title}</p>}
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
                {formErrors.amount && <p className="text-red-500">{formErrors.amount}</p>}
              </>
            )}
          </form.Field>
        </div>
        <div className="mb-4">
          <form.Field name="tag">
            {(field: FieldApi<string>) => (
              <>
                <Label htmlFor={field.name}>Tag:</Label>
                <select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="custom-tag-dropdown"
                >
                  <option value="" disabled>選択肢</option>
                  {tags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
                {formErrors.tag && <p className="text-red-500">{formErrors.tag}</p>}
              </>
            )}
          </form.Field>
        </div>
        <div className="mb-4">
          <form.Field name="date">
            {(field: FieldApi<string>) => (
              <>
                <Label htmlFor={field.name}>Date:</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="date"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
                {formErrors.date && <p className="text-red-500">{formErrors.date}</p>}
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
