export interface Cut {
  id: string;
  index: number;
  prompt: string;
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
}

export interface GenerateImageOptions {
  prompt: string;
  apiKey: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
}
