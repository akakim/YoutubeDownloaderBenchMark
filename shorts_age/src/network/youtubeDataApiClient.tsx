import axios from "axios";

const youtubeApiClient = axios.create({
  baseURL: import.meta.env.YOUTUBE_DATA_API_V3_URL,
});

const youtubeAPIMocClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
}); 


export { youtubeApiClient, youtubeAPIMocClient };