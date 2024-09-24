// 初期タグの定義
export const initialTags = ["食費", "交通費", "娯楽費", "光熱費", "固定費", "その他"];

// タグの取得: ローカルストレージから保存されているタグを含めたタグリストを返す
export function getTags(): string[] {
  const savedTags = JSON.parse(localStorage.getItem('expenseTags') || '[]');
  return [...initialTags, ...savedTags];
}

// タグでフィルタリング
export function selectTag(expenses: any[], selectedTag: string): any[] {
  if (!selectedTag) return expenses;
  return expenses.filter(expense => expense.tag === selectedTag);
}
