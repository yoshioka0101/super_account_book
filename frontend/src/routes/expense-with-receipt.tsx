import React, { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
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
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();

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

      //JSONで変換された結果を編集できる形式で表示する
      if (parsedData.items.length > 0) {
        setTitle(parsedData.items[0].item);
        setAmount(parsedData.items[0].price);
      }
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

  const handleSave = async () => {
    try {
      const response = await axios.post('/api/create-expense', {
        title,
        amount,
      });
      console.log('保存が成功しました', response.data);
      navigate('/');
    } catch (error) {
      // 404エラーの処理
      if (error.response?.status === 404) {
        console.error('保存先が見つかりませんでした', error);
      } else {
        console.error('保存中にエラーが発生しました', error);
      }
    }
  };

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
        {jsonOutput && (
          <div className="json-output">
            <h3>Parsed JSON Output:</h3>
            <pre>{JSON.stringify(jsonOutput, null, 2)}</pre>
          </div>
        )}
        {jsonOutput && (
          <div className="edit-section">
            <h3>家計簿に保存する:</h3>
            <label>
              タイトル:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              金額:
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <Button onClick={handleSave} style={{ height: 50 }}>
              確定
            </Button>
          </div>
        )}
        {error && <div className="error">{error}</div>}
      </main>
    </div>
  );
}
