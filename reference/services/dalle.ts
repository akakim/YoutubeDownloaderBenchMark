import type { GenerateImageOptions } from '../types';

export async function generateImage({
  prompt,
  apiKey,
  size = '1792x1024',
  quality = 'standard',
}: GenerateImageOptions): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size,
      quality,
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data.data[0].url as string;
}
