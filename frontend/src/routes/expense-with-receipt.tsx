import React, { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import Tesseract from 'tesseract.js'
import { Button } from '@/components/ui/button'
import './expense-with-receipt'

export const Route = createFileRoute('/expense-with-receipt')({
  component: ExpenseWithReceipt,
});

function ExpenseWithReceipt() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
 
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setImagePath(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleClick = () => {
    Tesseract.recognize(imagePath, 'eng', {
      logger: m => console.log(m),
    })
    .catch(err => {
      console.error(err);
    })
    .then(result => {
      if (result) {
        const confidence = result.confidence;
        const text = result.text;
        setText(text);
      }
    });
  };

  return (
    <div className="App">
      <main className="App-main">
        <h3>画像をアップロードしてください</h3>
        {imagePath && <img src={imagePath} className="App-image" alt="Uploaded" />}
        
        <h3>Extracted text</h3>
        <div className="text-box">
          <p>{text}</p>
        </div>
        <input type="file" onChange={handleChange} />
        <Button onClick={handleClick} style={{ height: 50 }}>
          テキストに変換
        </Button>
      </main>
    </div>
  );
}


