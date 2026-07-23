Q: ComfyUI는 API를 지원안하나보네.

A: 
아니요. ComfyUI는 오히려 API 지원이 핵심 기능 중 하나입니다.

많은 사람들이 GUI만 사용하는 것처럼 보이지만, 실제로는 API를 이용한 자동화가 매우 활발합니다.

기본 API

ComfyUI를 실행하면 보통 다음 주소로 API가 열립니다.

대표적인 엔드포인트는 다음과 같습니다.

API	설명
POST /prompt	워크플로우 실행
GET /history/{prompt_id}	작업 결과 조회
GET /view	생성된 이미지 다운로드
GET /queue	현재 작업 큐 조회
GET /object_info	노드 정보 조회


왜 API가 없는 것처럼 느껴질까?

ComfyUI는 REST API 문서(Swagger 같은 형태)를 크게 홍보하지 않기 때문에 처음엔 지원하지 않는 것처럼 보일 수 있습니다. 하지만 내부적으로는 API 기반으로 동작하며, 웹 UI도 이 API를 사용해 백엔드와 통신합니다.

특히 지금처럼 React + FastAPI로 자동 영상 제작 시스템을 만들고 있다면, ComfyUI API를 연결하는 것이 가장 자연스러운 구조입니다. 워크플로우를 템플릿으로 두고 프롬프트, 입력 이미지, 모델만 바꿔가며 자동 생성하는 방식이 많이 사용됩니다.

Q: 세상에 이 정보 출처가 어디야? 커뮤니티?

둘 다입니다. 다만 핵심은 공식 문서이고, 커뮤니티(ComfyUI,Reddit,GitHub)는 실제 사용 사례를 확인하는 용도로 참고했습니다.

제가 주로 참고하는 순서는 다음과 같습니다.

공식 ComfyUI 문서 (가장 신뢰)
서버 라우트 목록(/prompt, /history, /view, /object_info 등)이 공식적으로 정리되어 있습니다.
Cloud 문서에도 로컬 ComfyUI와 호환되는 API 설명이 포함되어 있습니다.
GitHub 이슈
API 사용법이 부족해서 개발자들이 직접 질문하고, 유지보수자나 커뮤니티가 답변을 남긴 내용입니다.
/prompt에 워크플로우(JSON)를 POST하는 방식 등이 반복적으로 설명됩니다.
Reddit (실전 사례)
React, FastAPI, Python, C# 등으로 ComfyUI를 붙인 사례가 많습니다.
예를 들어
"워크플로우를 API(JSON)로 Export한다."
"POST /prompt로 실행한다."
"/history/{prompt_id}로 완료를 확인한다."
"/view로 이미지를 가져온다."
같은 패턴이 실제 사용자들 사이에서 거의 표준처럼 사용됩니다.

React
    ↓
FastAPI
    ↓
ComfyUI API
    ↓
Image_z_image_turbo
    ↓
CapCut Draft

이 구조가 상당히 자연스럽습니다.

한 번 연결해 놓으면 이후에는 프롬프트만 바꿔서 수백 개의 장면을 자동 생성할 수 있습니다. 지금 만들고 있는 쇼츠 제작 시스템과도 궁합이 좋은 편입니다.


[장면생성 Tip]
리얼버전


3D 버전 
simple primitive 3D, clay-like, stylized, clean geometric shapes