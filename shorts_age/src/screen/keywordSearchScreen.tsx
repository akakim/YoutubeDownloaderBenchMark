import { Search, Bot, Settings, FileSearch } from "lucide-react";

import React, { useRef,useState } from 'react';
import '../styles/screen_channelRankingPage.css';
import ApiKeyBox from '../widget/apiKeyBox';
import DemoPage from '../widget/page';
import { youtubeAPIMocClient } from "../network/youtubeDataApiClient";
import { REGION_OPTIONS } from"../lib/region";
import { Button } from "@/components/ui/button";
import type { YoutubeTableRow } from "@/widget/columns";
import type {
  ChannelListResponse,
  VideoListResponse,
  SearchListItem,
  SearchListResponse
} from "@/network/mockItemType";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Spinner } from '@/components/ui/spinner';


export default function KeywordSearchScreen() {
 

  const PERIOD = {
    WEEK: "1주일",
    MONTH: "1달",
    TWO_MONTH:"2달",
    TRREE_MONTH: "3달",
    SIX_MONTH:"6달",
    ONE_YEAR:"1년"
  };

  
  const TAB = {
    KEYWORD: "keyword",
    RANKING: "ranking",
    GLOBAL: "global",
  };

  const SUBSCRIBE_FILTER={
    ALL:"전체", 
    MILLION:"~1만", 
    TEN_MILLION:"1만~10만", 
    FIFTY_MILLION:"10만~50만", 
    HUNDRED_MILLION:"50만~100만", 
    THOUSAND_MILLION:"100만+"
  }

  const resultFilter = { 
    DAY: "일일 조회수",
    TOTAL: "총 조회수",
    AVERAGE: "평균 조회수",
    HIT_RATE: "히트율(체급대비)",
    SUBSCRIBER: "구독자"
  }

  // const [activeCategories, setCategories] = useState(categories.ALL);
  const [activeRegion,setRegion] = useState(REGION_OPTIONS[0].ISO_3166_1_value);
  const previousRegionCodeRef = useRef(activeRegion);
  const [period, setPeriod] = useState(PERIOD.WEEK);
  const [subscribeFilter, setSubScribeFilter] = useState(SUBSCRIBE_FILTER.ALL);
  const [filteredData, setFilteredData] = useState(resultFilter.DAY);
  const [isSearching, setIsSearching] = useState(false);
  const [rankingRows, setRankingRows] = useState<YoutubeTableRow[]>([]);

  const handleSearchChannelRanking = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (isSearching) {
      return;
    }

    setIsSearching(true);

    youtubeAPIMocClient.get<SearchListResponse>('/api/testSearchList',{
      params: {
        part: 'snippet'
      }
    }).then((SearchListResponse) => {
      const videoIds = SearchListResponse.data.items
        .map((item) => item.id.videoId)
        .filter(Boolean)
        .join(',');

      console.log('videoIds', videoIds);

        youtubeAPIMocClient.get<VideoListResponse>('/api/testSmallVideoList',{
          params: {
            part: 'snippet,statistics,contentDetails',
            id: videoIds,
            type: 'video',
            maxResults:'50',
            order: 'viewCount',
            publishedAfter: '2023-01-01T00:00:00Z',
            q: '쇼츠',
            regionCode: 'KR',
            relevanceLanguage: 'ko',
            key: import.meta.env.VITE_YOUTUBE_DATA_API_KEY, 

          },
        })
      .then((videoResponse) => {
        const videoItems = videoResponse.data.items;

        const rows :YoutubeTableRow[] = videoItems.map((video) => ({
          videoId: video.id,
          source: 'Video',
          thumbnail: video.snippet?.thumbnails?.default?.url ?? '',
          title: video.snippet?.localized?.title ?? '',
          channelTitle: video.snippet?.channelTitle ?? '',
          publishedAt: video.snippet?.publishedAt ?? video.snippet?.publishAt ?? '',
          viewCount: video.statistics?.viewCount ?? '-',
          subscriberCount: '-',
          videoCount: '-',
        }));

        setRankingRows(rows);
        return rows;

      })

    })
    .catch((error) => {
      console.error('channel ranking mock request error', error);
    })
    .finally(() => {
      setIsSearching(false);
  });
  };

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const nextRegionCode = event.target.value
  const previousRegionCode = activeRegion

    previousRegionCodeRef.current = previousRegionCode
    setRegion(nextRegionCode)

    console.log("이전 값:", previousRegionCode)
    console.log("새 값:", nextRegionCode)
  }


  return (    

    <div className="page">


      
      <div className="titleArea">
          <div className="flex items-center gap-2">
            <h1><FileSearch size={40} strokeWidth={2.25} />  </h1>
            <p> 키워드 검색 </p>
          </div>
          <h2><p> 잘나가는 키워드 </p></h2>
      </div>

       

      
      <div className="categorySection">
        <h3>토픽 선택</h3>

         
        
      </div>

      {/* 국가 */}
      <div className="countrySection">
 
        <label>🌎 국가 </label>

        <NativeSelect value={activeRegion} onChange={handleRegionChange}>
          {REGION_OPTIONS.map((region) => (
            <NativeSelectOption key={region.value} value={region.value}>{region.label}</NativeSelectOption>
          ))}
        </NativeSelect>

      </div>

      {/* 기간 */}
      <div className="periodSection">
        <label>📅 기간 </label>

        <div className="periodButtons">
          
          {Object.entries(PERIOD).map(([key, value]) => (
              
            <Button 
              key = {key}
              variant={value === period ? "default":"outline" }
              onClick={()=>{ setPeriod(value) }} 
              >
               {value}
            </Button>

          ))}

        </div>
      </div>


       <section className="rankingWrap">
        <div className="rankingHeader">
          <div>
            총 <b>384개</b> 채널 · 기준: <b>1일 내 집계</b>
          </div>

          <div className="sortButtons">
            {Object.entries(resultFilter).map(([key, value]) => (
              <Button
                key={key}
                variant={value === filteredData ? "":"outline" }
                onClick={()=>{ 
                  setFilteredData(value); 
                  console.log('filteredData : '+ filteredData);
                  console.log('value : '+ value);
                  console.log('value === filteredData : '+ (value === filteredData));
                  

                }}>
                  {value}
                </Button>

            ))}  
            

          </div>
        </div>

        <div className="subscriberFilter">
          <span>👥 구독자 필터:</span>
          {Object.entries(SUBSCRIBE_FILTER).map(
            ([key, value]) => (
              <Button 
                key={key} 
                variant={value === subscribeFilter ? "":"outline" }
                onClick={()=>{ setSubScribeFilter(value)}}>
                
                {value}
              </Button>
          ))}
        </div>
        
          {isSearching && (<div className="flex w-full justify-center py-12">
            <Marker role="status" className="max-w-sm flex-col justify-center gap-4 text-center">
              <MarkerIcon className="size-16">
                <Spinner className="size-16 text-indigo-500"/> 
              </MarkerIcon>
              <MarkerContent className="w-full text-center">
                Loading channel ranking
              </MarkerContent>
            </Marker>
          </div>
          )}


        <div className="keywordSearchBar" aria-label="검색 키워드 입력 영역">
          <div className="keywordSearchInputBox">
            <span className="keywordSearchIcon">🎯</span>
            <Input
              placeholder="검색 키워드 또는 유튜브 영상 URL"
            >

            </Input>
          </div>
          <Button 
            key="searchChannelRanking"
            disabled={isSearching}
            onClick={handleSearchChannelRanking}
          >
            검색

          </Button>
          <button type="button" className="keywordResetButton">
            🔄 초기화
          </button>
        </div>

         
        <DemoPage data={rankingRows}></DemoPage>
        
        <div className="rankingTable">
          <div className="tableHead">
            <span>순위</span>
            <span>채널</span>
            <span>구독자</span>
            <span>영상수<br /><small>(1달)</small></span>
            <span>일일 조회수<br /><small>추정 일평균</small></span>
            <span>총 조회수<br /><small>(1달)</small></span>
            <span>평균 조회수</span>
            <span>히트율<br /><small>조회수/구독자</small></span>
            <span>대표 영상</span>
            <span></span>
          </div>

          <div className="tableRow">
            <span className="rank">1</span>

            <div className="channelInfo">
              <div className="avatar">쇼핑몰</div>
              <div>
                <div className="channelName">
                  쇼핑몰 <em>KR</em>
                </div>
                <p>@쇼핑몰-o6o</p>
              </div>
            </div>

            <span>4.1K</span>
            <span>3</span>
            <span className="orange">1,332,347</span>
            <span className="gold">11,908,625</span>
            <span>3,969,542</span>
            <span className="orange">2876.5x</span>

            <div className="videoThumb">
              <div className="thumbImg">대표<br />영상</div>
              <p>8,988,967회</p>
            </div>

            <span className="star">☆</span>
          </div>
        </div>
      </section>

      <div className="guideBox">
        <h3>💡 해석 가이드</h3>

        <ul>
          <li>
            <b>일일 조회수:</b> 각 영상의 조회수를 게시 후 경과일수로 나눈 뒤 모두 합한 값 —
            <b> "지금 하루에 대략 얼마나 조회수 버는 채널인지"</b> 추정치
          </li>
          <li>
            <b>총 조회수:</b> 최근 1달 동안 이 채널이 발생시킨 영상 조회수 합계
          </li>
          <li>
            <b>히트율:</b> 기간 조회수 ÷ 구독자수. <b>1배 이상이면 잘나가는 편, 10배 이상이면 폭발 중</b>
          </li>
          <li>표 위쪽의 정렬 버튼을 눌러 기준을 바꿀 수 있습니다</li>
          <li>채널명 클릭 시 유튜브 이동 · 대표 영상 썸네일 클릭 시 해당 영상 이동</li>
        </ul>
      </div>




    </div>
  );

}
