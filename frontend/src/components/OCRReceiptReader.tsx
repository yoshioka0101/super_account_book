import React from 'react'
import { useOCR } from '@/hooks/useOCR'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function OCRReceiptReader() {
  const { text, loading, error, processImage } = useOCR();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        processImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="ocr-reader">
      <Input type="file" onChange={handleFileChange} accept="image/*" />
      <Button onClick={processImage} disabled={loading}>
        {loading ? 'Processing...' : 'Convert to text'}
      </Button>
      {error && <div className="error">{error}</div>}
      {text && <div className="text-output">{text}</div>}
    </div>
  );
}
