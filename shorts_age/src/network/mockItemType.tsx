
export type SearchListItem = {
  id: {
    videoId: string;
  };
  snippet: {
    channelId: string;
    title: string;
    channelTitle: string;
    publishTime: string;
  };
};

export type SearchListResponse = {
  items: SearchListItem[];
};


export type VideoListResponse = {
  items: {
    id: string;
    statistics?: {
      viewCount?: string;
      likeCount?: string;
      commentCount?: string;
    };
    contentDetails?: {
      duration?: string;
    };
  }[];
};

export type ChannelListResponse = {
   items: {
    id: string;
    statistics?: {
      subscriberCount?: string;
      videoCount?: string;
    };
  }[];
};
