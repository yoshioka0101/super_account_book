import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import api from '../api';

export const Route = createFileRoute('/expense-with-receipt')({
  component: ExpenseWithReceipt,
});

function ExpenseWithReceipt() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");

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

  const handleClick = async () => {
    const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
    console.log(apiKey);

    // Keyの指定が誤っていた場合などに関する例外処理
    if (!apiKey) {
      console.error('API key is missing');
      setError('API key is missing');
      return;
    }

    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    try {
      const response = await axios.post(visionApiUrl, {
        requests: [
          {
            image: {
              content: imagePath.split(",")[1], // Base64 encoded image data
            },
            features: [{ type: "TEXT_DETECTION" }],
          },
        ],
      });

      const extractedText = response.data.responses[0].fullTextAnnotation?.text || '';
      setText(extractedText);
    } catch (err) {
      console.error('Error with OCR:', err);
      setError('Error processing the image');
    }
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
        {error && <div className="error">{error}</div>}
      </main>
    </div>
  );
}
