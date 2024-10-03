import axios from 'axios';

export const callGoogleVisionApi = async (base64Image) => {
  const apiKey = 'f37136ef4df1d2d26f2474a1e07da0fcc266384f';
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  const body = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: 'TEXT_DETECTION',
          },
        ],
      },
    ],
  };

  try {
    const response = await axios.post(url, body);
    const detectedText = response.data.responses[0].fullTextAnnotation.text;
    return detectedText;
  } catch (error) {
    console.error('Error calling Google Vision API:', error);
    return '';
  }
};
