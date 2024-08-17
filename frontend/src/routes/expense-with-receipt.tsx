import React, { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export const Route = createFileRoute('/expense-with-receipt')({
  component: ExpenseWithReceipt,
});

function ExpenseWithReceipt() {
  const [imagePath, setImagePath] = useState("");
  const [text, setText] = useState("");
  const [jsonOutput, setJsonOutput] = useState(null);
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

      // パースしてJSON形式に変換する
      const parsedData = parseReceiptText(extractedText);
      setJsonOutput(parsedData);

    } catch (err) {
      console.error('Error with OCR:', err);
      setError('Error processing the image');
    }
  };

  // レシートテキストをJSONにパースする関数
  function parseReceiptText(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    const itemRegex = /(.+?) ¥([\d,]+)/;
    const items = [];
    let total = 0;

    lines.forEach(line => {
      const match = line.match(itemRegex);
      if (match) {
        const item = match[1].trim();
        const price = parseInt(match[2].replace(/,/g, ''), 10);
        items.push({ item, price });
        total += price;
      }
    });

    return {
      items,
      total,
    };
  }

  return (
    <div className="App">
      <main className="App-main">
        <h3>画像をアップロードしてください</h3>
        {imagePath && <img src={imagePath} className="App-image" alt="Uploaded" />}
        <input type="file" onChange={handleChange} />
        <Button onClick={handleClick} style={{ height: 50 }}>
          テキストに変換
        </Button>
        <h3>Extracted text</h3>
        <div className="text-box">
          <p>{text}</p>
        </div>
        {error && <div className="error">{error}</div>}
        {jsonOutput && (
          <div className="json-output">
            <h3>Parsed JSON Output:</h3>
            <pre>{JSON.stringify(jsonOutput, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  );
}
