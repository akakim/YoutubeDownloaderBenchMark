/**
 * KeyManagementSystem을 위한 
 */
export type KMSRow = {
  kmsID:string
  serviceType: string
  alias: string
  value: string
};


export const GPT_PREFIX = "gpt-key-"
export const GPT_TABLE = "gpt-table"

export const GEMINI_PREFIX = "gemini-key-"
export const GEMINI_TABLE = "gemini-table"

export const YOUTUBE_DATA_API_V3_PREFIX = "youtube-data-api-v3-"
export const YOUTUBE_DATA_API_V3_TABLE = "youtube-data-api-table"
