import React, { useRef,useState } from 'react';

import '../styles/screen_channelRankingPage.css';
import ApiKeyBox from '../widget/apiKeyBox';
import youtubeApiClient from "../network/youtubeDataApiClient";
import { REGION_OPTIONS } from"../lib/region";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {AxiosRequestConfig} from 'axios';
export default function GoodShortsPage() {

  const categories = {
    전체:"전체", 먹방: "먹방", 요리: "요리",뷰티: "뷰티",게임: "게임",브이로그:"브이로그",운동: "운동/헬스",
    주식: "주식/투자",부동산: "부동산",반려동물: "반려동물",자동차: "자동차",여행: "여행",육아: "육아",패션: "패션",
    ASMR: "ASMR",음악: "음악/커버", IT: "IT/테크",영화리뷰: "영화 드라마 리뷰",책: "책/독서",코미디: "코미디",뉴스: "뉴스/시사",
    공부: "공부/학습",DIY: "DIY/공예",인테리어: "인테리어/홈데코",스포츠: "스포츠 관전",자기계발: "자기계발",만화: "만화/애니",댄스: "댄스/춤",
    캠핑: "캠핑/아웃도어",낚시: "낚시",사진: "사진/카메라",풍경: "자연/풍경",미스터리: "공포/미스터리",커리어: "직장/커리어",외국어: "외국어 학습",
    결혼: "결혼/웨딩",상식: "신기한 잡학/상식"
  };

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

  const [activeTab, setActiveTab] = useState(TAB.KEYWORD);
  const [activeCategories, setCategories] = useState(categories.전체);
  const [period, setPeriod] = useState(PERIOD.WEEK);
  const [subscribeFilter, setSubScribeFilter] = useState(SUBSCRIBE_FILTER.ALL);
  // const []=useState(day);
  const [showTabs, setShowTabs] = useState(true);
  const [regionCode, setRegionCode] = useState("");

  // async function getSearch() {

  //   const searchResponse = await youtubeApiClient.get('/search', { 
  //     params: {
  //       q: "cat",
  //       maxResults: 10,
  //       regionCode: "KR"
  //     }
  //   }
  //   .then(res => console.log('then : ' + res.data)));

  //     return searchResponse.data;
  // };

  return (    

    <div className="page">

      {/* 상단 탭 */}
      <div className="topTabs">
        <div className={`tab ${activeTab === TAB.KEYWORD ? "active" : ""}`}
            onClick={()=>setActiveTab(TAB.KEYWORD)}>
          🎯
          <div>
            <h3>키워드 검색</h3>
            <p>키워드/URL로 영상 탐색</p>
          </div>
        </div>

        <div className={`tab ${activeTab === TAB.RANKING ? "active" : ""}`}
            onClick={()=>setActiveTab(TAB.RANKING)}>
          📊
          <div>
            <h3>요즘 잘하는 채널 랭킹!</h3>
            <p>카테고리별 급상승 채널</p>
          </div>
        </div>

        <div className={`tab ${activeTab === TAB.GLOBAL ? "active" : ""}`}
            onClick={()=>setActiveTab(TAB.GLOBAL)}>
          🌎
          <div>
            <h3>터진 영상은 또 터진다!</h3>
            <p>국가별 비교</p>
          </div>
        </div>
      </div>

      {/* API 카드 */}

      <ApiKeyBox />

      {/* 제목 */}
      <div className="titleArea stickyTitle">
        {/* <h1>📊 요즘 잘하는 채널 랭킹!</h1>
        <p>
          최근 1달 동안 조회수를 잘 뽑은 채널들을 카테고리별로 찾아보세요.
        </p> */}

        {
          activeTab === TAB.RANKING ? (
            <div className='tab'>
              <div>
                <h1>📊요즘 잘하는 채널 랭킹!</h1>
                <p>카테고리별 급상승 채널</p>
              </div>
            </div>
          ) : activeTab === TAB.GLOBAL ? (
              <div className='tab'>
                <div>
                  <h1>🌎터진 영상은 또 터진다!</h1>
                  <p>국가별 비교</p>
                </div>
              </div>
          ) : (
            <div className='tab'>
              <div>
                <h1>🎯 키워드 검색</h1>
                <p>키워드/URL로 영상 탐색</p>
              </div>
            </div>
          )
        }

      </div>

      {/* <div className="apiSection">
        <div className="apiCard">
          <div>
            <strong>My First Project의 키</strong>
            <div>1,828 / 10,000</div>
          </div>

          <div className="progress">
            <div className="fill"></div>
          </div>
        </div>

        <div className="buttons">
          <button>+ 키 추가</button>
          <button>발급방법</button>
          <button className="guideBtn">📺 영상 가이드</button>
        </div>
      </div> */}

      
      <div className="categorySection">
        <h3>토픽 선택</h3>

        <div className="categoryGrid">
          {Object.entries(categories).map(([key, value]) => (

            <Button 
              key = {key}
              variant={key === activeCategories ? "":"outline" }
              onClick={()=>{ setCategories(key) }} 
              >
               {value}
            </Button>

          ))}
        </div>
        
      </div>

      {/* 국가 */}
      <div className="countrySection">
 
        <label>🌎 국가 - 현재 : KR 한국</label>

        <select>
          {REGION_OPTIONS.map((region) => (
            <option key={region.ISO_3166_1_value} value={region.ISO_3166_1_value}>
              {region.label}
            </option>
          ))}
        </select>
      </div>

      {/* 기간 */}
      <div className="periodSection">
        <label>📅 기간 - 현재 : 1달</label>

        <div className="periodButtons">
        
          {Object.entries(PERIOD).map(([key, value]) => (

            <Button 
              key = {key}
              variant={key === period ? "":"outline" }
              onClick={()=>{ setPeriod(key) }} 
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
            <button className="active">⚡ 일일 조회수</button>
            <button>🔥 총 조회수</button>
            <button>📊 평균 조회수</button>
            <button>💥 히트율(체급대비)</button>
            <button>👥 구독자</button>
          </div>
        </div>

        <div className="subscriberFilter">
          <span>👥 구독자 필터:</span>
          {Object.entries(SUBSCRIBE_FILTER).map(
            ([key, value]) => (
              <Button 
                key={key} 
                variant={key === SUBSCRIBE_FILTER.ALL ? "":"outline" }
                onClick={()=>{ setSubScribeFilter(key)}}>
                
                {value}
              </Button>
          ))}
        </div>

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
