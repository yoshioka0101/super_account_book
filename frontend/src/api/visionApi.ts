import axios from 'axios';

const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${import.meta.env.VITE_GOOGLE_VISION_API_KEY}`;

export async function annotateImage(base64Image: string) {
  try {
    const response = await axios.post(visionApiUrl, {
      requests: [
        {
          image: {
            content: base64Image,
          },
          features: [{ type: "TEXT_DETECTION" }],
        },
      ],
    });
    return response.data.responses[0];
  } catch (error) {
    console.error("Error with Google Vision API:", error);
    throw error;
  }
}

export function saveAsJson(data: any, filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
