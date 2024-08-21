import { useState } from 'react';
import { recognizeText } from '@/api/ocr';

export function useOCR() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const processImage = async (imagePath: string) => {
    setLoading(true);
    setError('');
    try {
      const result = await recognizeText(imagePath);
      setText(result);
    } catch (err) {
      setError('OCR処理中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return { text, loading, error, processImage };
}
