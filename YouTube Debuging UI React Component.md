# YouTube Dubbing UI React Component

이 파일 묶음은 제공된 참고 화면을 기반으로 제작한 **React UI 컴포넌트**입니다. 화면은 좌측 소개 패널과 우측 입력 폼으로 구성되어 있으며, 유튜브 롱폼 영상 URL, 쇼츠 입력, 음성 인식 정확도, 자막 파일 선택 영역을 포함합니다.

## 포함 파일

| 파일 | 설명 |
|---|---|
| `YoutubeDubbingUI.jsx` | React 컴포넌트 코드입니다. 입력 상태와 버튼 선택 상태를 `useState`로 관리합니다. |
| `YoutubeDubbingUI.css` | 참고 화면의 카드형 레이아웃, 보라색 포커스 라인, 반응형 스타일을 구현한 CSS입니다. |

## 사용 방법

React 프로젝트에서 아래처럼 컴포넌트를 불러와 사용하면 됩니다.

```jsx
import YoutubeDubbingUI from './YoutubeDubbingUI';
import './YoutubeDubbingUI.css';

function App() {
  return <YoutubeDubbingUI />;
}

export default App;
```

## 구현 포인트

참고 화면의 핵심 요소였던 **좌측 홍보/일러스트 영역**, **우측 폼 카드**, **URL/파일 토글 버튼**, **쇼츠 입력 방식 선택**, **음성 인식 정확도 선택**, **체크박스 옵션**, **파일 선택 드롭존**을 React 상태 기반 UI로 구성했습니다. 실제 파일 업로드나 API 연동은 연결하지 않았으므로, 필요하면 `onChange`, `onSubmit`, 파일 입력 로직을 추가해 확장할 수 있습니다.
