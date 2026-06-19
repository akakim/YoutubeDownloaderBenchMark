import React, { useRef,useState } from 'react';
// import '../css/screen_videoToSTT.css';

import '../css/screen_videoToSTT.css';
const accuracyOptions = [
  { id: 'fast', label: '빠름', icon: '⚡' },
  { id: 'balanced', label: '균형', icon: '⚖️' },
  { id: 'accurate', label: '정확', icon: '🎯' },
];

function SegmentedButton({ active, icon, children, onClick }) {
  return (
    <button
      type="button"
      className={`segmented-button ${active ? 'is-active' : ''}`}
      onClick={onClick}
    >
      <span className="button-icon">{icon}</span>
      {children}
    </button>
  );
}

function TextInput({ value, onChange, placeholder }) {
  return (
    <input
      className="text-input"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  );
}

export default function VideoToSTT() {

    const fileInputRef = useRef(null);
    const [sourceType, setSourceType] = useState('file');
    const [inputMode, setInputMode] = useState('video-url');
    const [scriptType, setScriptType] = useState('file');
    const [accuracy, setAccuracy] = useState('balanced');
    const [matchAll, setMatchAll] = useState(false);
    const [productUrl, setProductUrl] = useState('https://www.youtube.com/watch?v=IrfOIA0NjaA');
    const [shortsUrl, setShortsUrl] = useState('https://www.youtube.com/watch?v=GFO4zuZ5zQI');
    const handleFileButtonClick = () => {
    //  setSourceType('file');
    fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setProductUrl(file.name);
    };
  return (
    <div>
         <section className="hero-panel" aria-label="서비스 소개 영역">
            <div className="floating-card video-preview">
              <div className="video-avatar" />
              <div className="video-playline" />
            </div>

            <div className="spark-orb">✦</div>

            <div className="floating-card editor-preview">
              <div className="editor-screen">
                <div className="editor-face" />
                <div className="editor-timeline">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>

            <div className="intro-copy">
              <p className="eyebrow">AI Dubbing Studio</p>
              <h1>유튜브 롱폼을<br />틱톡 컷편집으로 한 번에</h1>
              <p>
                자동 자막, 대본 정리, 영상 매칭을 한 화면에서 처리할 수 있는
                콘텐츠 변환 UI입니다.
              </p>

              <ol className="feature-list">
                <li><strong>01</strong> 영상 URL 또는 파일 입력</li>
                <li><strong>02</strong> 쇼츠 소스와 대본 업로드</li>
                <li><strong>03</strong> 음성 인식 정확도 선택</li>
              </ol>
            </div>
          </section>

          <section className="form-panel" aria-label="더빙 생성 입력 폼">
            <div className="form-card">
              <div className="field-group">
                <label className="field-label">🎥 롱폼 영상</label>
                <div className="button-grid two-columns">
                  
                  <SegmentedButton
                    icon="🔗"
                    active={sourceType === 'url'}
                    aria-disabled={true}
                  >
                    URL
                  </SegmentedButton>

                  <SegmentedButton
                    icon="📁"
                    active={sourceType === 'file'}
                    onClick={handleFileButtonClick}
                  >
                    파일
                  </SegmentedButton>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />

                <TextInput
                  value={productUrl}
                  onChange={setProductUrl}
                  placeholder="파일을 선택하세요"
                />
              </div>

              <div className="field-group">
                <label className="field-label">✂️ 쇼츠 입력</label>
                <div className="button-grid two-columns">
                  <SegmentedButton
                    icon="🎬"
                    active={inputMode === 'video-url'}
                    onClick={() => setInputMode('video-url')}
                  >
                    영상 URL
                  </SegmentedButton>
                  <SegmentedButton
                    icon="📝"
                    active={inputMode === 'script'}
                    onClick={() => setInputMode('script')}
                  >
                    대본 텍스트
                  </SegmentedButton>
                </div>
                <div className="button-grid two-columns compact">
                  <SegmentedButton
                    icon="🔗"
                    active={scriptType === 'url'}
                    onClick={() => setScriptType('url')}
                  >
                    URL
                  </SegmentedButton>
                  <SegmentedButton
                    icon="📁"
                    active={scriptType === 'file'}
                    onClick={() => setScriptType('file')}
                  >
                    파일
                  </SegmentedButton>
                </div>
                <TextInput value={shortsUrl} onChange={setShortsUrl} placeholder="쇼츠 영상 URL을 입력하세요" />
              </div>

              <div className="field-group">
                <label className="field-label">🎙️ 음성 인식 정확도</label>
                <div className="button-grid three-columns">
                  {accuracyOptions.map((option) => (
                    <SegmentedButton
                      key={option.id}
                      icon={option.icon}
                      active={accuracy === option.id}
                      onClick={() => setAccuracy(option.id)}
                    >
                      {option.label}
                    </SegmentedButton>
                  ))}
                </div>
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={matchAll}
                  onChange={(event) => setMatchAll(event.target.checked)}
                />
                <span>
                  <strong>전체 시각 매칭 모드</strong>
                  <small>대사 무시, 화면만으로 매칭</small>
                </span>
              </label>

              <div className="upload-box">
                <label className="field-label">🎨 자막 합성컷 선택</label>
                <div className="drop-zone">
                  <span>subtitle_info.json 파일 선택</span>
                </div>
              </div>

              <div className="upload-box muted">
                <label className="field-label">📂 프로젝트 이름 선택</label>
                <div className="drop-zone small">
                  <span>자동: AutoCut_Project</span>
                </div>
              </div>

              <button type="button" className="submit-button">
                더빙 컷편집 시작하기
              </button>
            </div>
          </section>
    </div>

    
          
          
  );

}