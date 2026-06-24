import axios from "axios";

const youtubeApiClient = axios.create({
  baseURL: import.meta.env.YOUTUBE_DATA_API_V3_URL,
});

export default youtubeApiClient;