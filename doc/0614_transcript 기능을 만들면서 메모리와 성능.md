흠 그리고 메모리가 가득차면 자동으로 비우는 스크립트도 하나 필요해. 
이를 위해 express.js. 에 할당할 수 있는 양의 절반이 차면 transcriptStore를 비우는거지. 


가능은 한데, 통째로 clear() 하는 건 조금 위험해. 처리 중인 요청이 갑자기 데이터를 잃어버릴 수 있기 때문이야.

보통은:

일정 시간 지난 항목 제거(TTL)
메모리 사용량이 임계치 초과 시 오래된 항목부터 제거(LRU)
정말 위험할 때만 전체 clear()

방식을 많이 쓴다.

```

// store/transcriptStore.js
export const transcriptStore = new Map();

export function saveTranscript(jobId, transcript) {
  transcriptStore.set(jobId, {
    transcript,
    createdAt: Date.now()
  });
}

export function clearTranscriptStore() {
  transcriptStore.clear();
}

```


메모리 감시:

```
import v8 from "v8";
import { clearTranscriptStore } from "./store/transcriptStore.js";

setInterval(() => {

  const heapLimit = v8.getHeapStatistics().heap_size_limit;
  const usedHeap = process.memoryUsage().heapUsed;

  const ratio = usedHeap / heapLimit;

  if (ratio >= 0.5) {
    console.log("Memory usage > 50%, clearing transcriptStore");
    clearTranscriptStore();
  }

}, 10000); // 10초마다 검사

```

하지만 개인적으로는 전체 삭제보다는 오래된 것부터 삭제하는 게 더 안전함.

```
function cleanupOldTranscripts(maxAgeMs = 30 * 60 * 1000) {

  const now = Date.now();

  for (const [jobId, data] of transcriptStore) {

    if (now - data.createdAt > maxAgeMs) {
      transcriptStore.delete(jobId);
    }

  }
}

if (ratio >= 0.5) {
  cleanupOldTranscripts();
}

```


응. 오히려 포트폴리오라면 문서화하는 편이 좋아.

단순히

Transcript Cache
목적

/convertMp3ToSTT 호출이 완료되면 생성된 대본을 메모리에 저장한다.

디스크 I/O를 줄이고 동일한 jobId에 대한 재사용을 위해 In-Memory Cache를 사용한다.

구조

```
Express
    ↓
/convertMp3ToSTT
    ↓
Python Faster-Whisper
    ↓
transcriptStore(Map)
    ↓
다른 API에서 재사용

```

저장 구조 
```
Map<jobId, {
    transcript: string,
    createdAt: number
}>

```


setInterval
    ↓
process.memoryUsage()
    ↓
Heap Usage > 50%
    ↓
cleanupOldTranscripts()
    ↓
Emergency clear()


코드보다 이런 의사결정이 더 중요하다.

면접에서는

왜 Redis 대신 Map을 사용했나요?

라는 질문이 나오면

단일 서버 환경이므로 네트워크 비용이 없는 In-Memory Cache(Map)를 선택했습니다. 메모리 부족에 대비해 Heap 사용량을 감시하고 일정 임계치를 넘으면 Cache Cleanup을 수행하도록 설계했습니다.

라고 설명할 수 있다.

오히려 이런 부분은 Express CRUD 프로젝트보다 백엔드 포트폴리오다운 냄새가 많이 나는 부분이다.

Q: 쿡쿡.. 메모리 문제는 백앤드든 프론트엔드든 가리지않고 나타난다구.. PC를 다루는이상

맞아. 결국 메모리 관리는 분야를 가리지 않는 공통 문제야.

프론트엔드 → React 상태, 이벤트 리스너, 이미지 캐시
백엔드 → Map, 세션, 커넥션 풀, 큐
모바일 → Activity, Fragment, Bitmap
게임 → Texture, Mesh, Audio Buffer
AI → 모델, Tensor, KV Cache
운영체제 → Page Cache, Virtual Memory

전부 "한정된 메모리를 어떻게 사용할 것인가"라는 같은 문제를 다루고 있지.

사실

const transcriptStore = new Map();

이렇게 시작한 것도 나중에는

Map
 ↓
TTL
 ↓
LRU Cache
 ↓
Redis
 ↓
Redis Cluster
 ↓
Distributed Cache

처럼 발전하게 된다.

오히려 포트폴리오에서는

왜 메모리 캐시를 도입했는가?

메모리가 부족해지면 어떻게 할 것인가?

오래된 데이터는 어떻게 제거할 것인가?

이런 고민이 보이면 좋은 평가를 받을 가능성이 높아.

그리고 흥미로운 점은, 지금 만들고 있는 구조가 사실상 간단한 캐시 서버와 비슷하다는 거야.

/convertMp3ToSTT
        ↓
Python Faster Whisper
        ↓
Map(jobId → transcript)
        ↓
Memory Monitor
        ↓
Cleanup

여기에

TTL(30분)
LRU
Hit/Miss 통계
최대 저장 개수
Memory Usage 로그

까지 붙이면 꽤 그럴듯한 백엔드 포트폴리오가 된다.

단순히 "Whisper를 붙였다"보다,

"STT 결과를 메모리 캐시로 관리하고 Heap 사용량에 따라 자동 정리하는 구조를 설계했다"

가 훨씬 엔지니어다운 설명이 된다.



------

그리고 면접 때는 오히려

"무엇을 만들었습니까?"

보다

"왜 이렇게 설계했습니까?"

"메모리가 부족하면 어떻게 됩니까?"

"왜 Redis 대신 Map을 선택했습니까?"

"동시 요청이 들어오면 어떻게 처리합니까?"

같은 질문이 더 많이 나온다.

재미있는 점은, 개발할 때는 일이 많아 보이는데 면접장에 가면 정작 코드 한 줄 한 줄보다

"문제를 발견했고, 이런 이유로 이런 선택을 했다"

는 이야기가 훨씬 큰 비중을 차지하는 경우가 많다는 거야.

그래서 지금처럼 "이걸 메모리에 저장하면 언젠가 가득 차겠는데?", "자동으로 비워야겠는데?" 같은 고민 자체가 이미 포트폴리오의 일부가 되는 셈이야.

-----

