import React, { useRef,useState } from 'react';

import '../css/screen_channelRankingPage.css';
export default function ChannelRankingPage() {

  const categories = [
    "전체", "먹방", "요리", "뷰티", "게임", "브이로그", "운동/헬스",
    "주식/투자", "부동산", "반려동물", "자동차", "여행", "육아", "패션",
    "ASMR", "음악/커버", "IT/테크", "영화/드라마 리뷰", "책/독서", "코미디", "뉴스/시사",
    "공부/학습", "DIY/공예", "인테리어/홈데코", "스포츠 관전", "자기계발", "만화/애니", "댄스/춤",
    "캠핑/아웃도어", "낚시", "사진/카메라", "자연/풍경", "공포/미스터리", "직장/커리어", "외국어 학습",
    "결혼/웨딩", "신기한 잡학/상식"
  ];

  return (
    <div className="page">

      {/* 상단 탭 */}
      <div className="topTabs">
        <div className="tab">
          🎯
          <div>
            <h3>키워드 검색</h3>
            <p>키워드/URL로 영상 탐색</p>
          </div>
        </div>

        <div className="tab active">
          📊
          <div>
            <h3>요즘 잘하는 채널 랭킹!</h3>
            <p>카테고리별 급상승 채널</p>
          </div>
        </div>

        <div className="tab">
          🌎
          <div>
            <h3>터진 영상은 또 터진다!</h3>
            <p>국가별 비교</p>
          </div>
        </div>
      </div>

      {/* 제목 */}
      <div className="titleArea">
        <h1>📊 요즘 잘하는 채널 랭킹!</h1>
        <p>
          최근 1달 동안 조회수를 잘 뽑은 채널들을 카테고리별로 찾아보세요.
        </p>
      </div>

      {/* API 카드 */}
      <div className="apiSection">
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
      </div>

      {/* 토픽 선택 */}
      <div className="categorySection">
        <h3>토픽 선택</h3>

        <div className="categoryGrid">
          {categories.map((item) => (
            <button
              key={item}
              className={item === "전체" ? "category active" : "category"}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* 국가 */}
      <div className="countrySection">
        <label>🌎 국가 - 현재 : KR 한국</label>

        <select>
          <option>KR 한국</option>
        </select>
      </div>

      {/* 기간 */}
      <div className="periodSection">
        <label>📅 기간 - 현재 : 1달</label>

        <div className="periodButtons">
          <button>1주일</button>
          <button className="active">1달</button>
          <button>2달</button>
          <button>3달</button>
          <button>6달</button>
          <button>1년</button>
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
          {["전체", "~1만", "1만~10만", "10만~50만", "50만~100만", "100만+"].map(
            (item) => (
              <button key={item} className={item === "전체" ? "active" : ""}>
                {item}
              </button>
            )
          )}
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