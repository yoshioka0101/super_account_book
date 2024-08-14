// Google Vision APIキーを取得する関数
export const getGoogleVisionApiKey = () => {
  const apiKey = process.env.GOOGLE_VISION_API_KEY;

  if (!apiKey) {
    throw new Error('Google Vision APIキーが見つかりません');
  }
  return apiKey;
};

// export const getLineApiKey = () => {
//   const apiKey = process.env.LINE_API_KEY;

//   if (!apiKey) {
//     throw new Error('LINE APIキーが見つかりません');
//   }

//   // 取得したAPIキーを返します。
//   return apiKey;
// };

// これらの関数を他のモジュールで使えるようにエクスポートします。
export default {
  getGoogleVisionApiKey,
  //getLineApiKey,
};
