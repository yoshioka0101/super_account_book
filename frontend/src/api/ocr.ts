import axios from 'axios'

export async function recognizeText(imagePath: string): Promise<string> {
  const response = await axios.post('/api/ocr', { image: imagePath });
  return response.data.text;
}
