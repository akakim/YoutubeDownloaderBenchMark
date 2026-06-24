Indexed DB는 뭐야? localStorage와 비교해서 설명해줘

좋은 질문이야. 간단히 말하면,

localStorage = 메모장

IndexedDB = 브라우저 안의 SQLite 같은 데이터베이스

라고 생각하면 된다.

1. localStorage
localStorage.setItem("name", "아쿠아");
localStorage.setItem("age", 35);

console.log(localStorage.getItem("name"));
특징
Key-Value 구조
문자열만 저장 가능(JSON 변환 필요)
사용법 매우 쉬움
동기(Sync)
용량 약 5MB
저장 모습
selectedTopic = "주식/투자"

apiKey =
{
    alias:"메인키",
    key:"AIza..."
}

searchCondition =
{
    q:"주식 투자",
    country:"KR"
}

작은 설정값 저장용.

2. IndexedDB

브라우저 안의 데이터베이스.

DB : YoutubeHunter

Table : Videos

--------------------------------
videoId
title
channelId
viewCount
publishedAt
--------------------------------

abc123
제목1
채널1
10000
2025-01-01

def456
제목2
채널2
20000
2025-01-02

SQL은 없지만 비슷한 느낌.

localStorage와 비교
항목	localStorage	IndexedDB
구조	Key-Value	Database
용량	약 5MB	수십~수백 MB
속도	빠름	빠름
데이터양	적음	많음
객체 저장	JSON 변환 필요	가능
배열 저장	JSON 변환 필요	가능
검색 기능	없음	있음
비동기	X	O
사용 난이도	쉬움	어려움
적합한 용도	설정값	대용량 데이터