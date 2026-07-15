/**
 * KeyManagementSystem을 위한 
 */
export type KMSRow = {
  dKmsID:string
  dServiceType: string
  dAlias: string
  dValue: string
};

export type KMSFieldRow = KMSRow & {
  uIsNew: boolean
  uID: string
}



export const GPT_PREFIX = "gpt-key-"
export const GPT_TABLE = "gpt-table"

export const GEMINI_PREFIX = "gemini-key-"
export const GEMINI_TABLE = "gemini-table"

export const YOUTUBE_DATA_API_V3_PREFIX = "youtube-data-api-v3-"
export const YOUTUBE_DATA_API_V3_TABLE = "youtube-data-api-table"


export const API_KEY_TYPES = [
  {
    table: GPT_TABLE,
    prefix: GPT_PREFIX,
    label: "ChatGPT API Key",
    addButtonText: "Add ChatGPT API Key",
  },
  {
    table: GEMINI_TABLE,
    prefix: GEMINI_PREFIX,
    label: "Gemini API Key",
    addButtonText: "Add GEMINI API Key",
  },
  {
    table: YOUTUBE_DATA_API_V3_TABLE,
    prefix: YOUTUBE_DATA_API_V3_PREFIX,
    label: "YouTube Data API v3 Key",
    addButtonText: "Add YouTube Data API v3 Key",
  },
]
