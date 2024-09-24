import * as React from 'react';
import { useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from '@tanstack/react-form';
import type { FieldApi } from '@tanstack/react-form';
import { api } from '@/lib/api';
import { useNavigate } from '@tanstack/react-router';
import { initialTags } from '@/utils/tag';

export const Route = createFileRoute('/create-income')({
  component: CreateExpense,
})

function CreateExpense() {
  const navigate = useNavigate()
  const [formErrors, setFormErrors] = React.useState<Record<string, string>>({})
  const [submittedDate, setSubmittedDate] = React.useState<string | null>(null)
  const [tags, setTags] = React.useState<string[]>([])

  useEffect(() => {
    const savedTags = JSON.parse(localStorage.getItem('incomeTags') || '[]');
    setTags([...initialTags, ...savedTags]);
  }, []);

  const form = useForm({
    defaultValues: {
      date: '',
      title: '',
      amount: 0,
      tag: '',
    },
    onSubmit: async ({ value }) => {
      // エラーメッセージをリセット
      setFormErrors({});

      // フォームのバリデーション
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

      // 日付をISO-8601形式に変換
      const formattedDate = new Date(value.date).toISOString();
      setSubmittedDate(formattedDate.split('T')[0]);

      // サーバーサイドバリデーション
      const res = await api.incomes.$post({
        json: {
          ...value,
          date: formattedDate,
        }
      });

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
      navigate({ to: '/incomes' });
    },
  });

  return (
    <div className="p-2">
      <h2>Create Expense</h2>
      <form
        className='max-w-xl m-auto'
        onSubmit={form.handleSubmit}
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
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    if (formErrors.tag) setFormErrors(prev => ({ ...prev, tag: '' }));
                  }}
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
      {/* 提出された日付を表示 */}
      {submittedDate && (
        <div className="mt-4">
          <p>Submitted Date: {submittedDate}</p>
        </div>
      )}
    </div>
  );
}