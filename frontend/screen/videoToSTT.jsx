import React, { useRef,useState } from 'react';
import axios from "axios";
import apiClient from "../network/apiClient";

import '../css/screen_videoToSTT.css';
import ErrorPopup from '../widget/errorPopup';
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

async function uploadVideo(file) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("file_name", file.name);

  console.log('file : ',file);
  const uploadResponse = await apiClient.post("/upload", formData,{
    headers: {
        "Content-Type": "multipart/form-data",
    },
  });

  // const response = await axios.post(
  //   "http://localhost:5174/upload",
  //   formData,
  //   {
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   }
  // );

  return uploadResponse.data
}



export default function VideoToSTT({ onError }) {

  const [files, setFiles] = useState([]);
  const [model, setModel] = useState("small");
  const [language, setLanguage] = useState("ko");
  const [format, setFormat] = useState("srt");
  const [isDragging, setIsDragging] = useState(false);


  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    console.log('handleFileChange : ' + files);
  };

  const addFiles = (fileList) => {
  const selected = Array.from(fileList || []);
  if (selected.length === 0) return;

    setFiles((prev) => [...prev, ...selected]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    addFiles(e.dataTransfer.files);
  };

  const mp4ToSTT = async () => {
       try {
        // 1. MP4 업로드
        const uploadResult = await uploadVideo(files[0]);
        if (!uploadResult.success) {
          throw new Error(uploadResult.error);
        }

        const jobId = uploadResult.jobId;

        // 2. MP4 → MP3
        const mp3Response = await apiClient.post("/api/convertMp4ToMp3",{
           jobId: jobId
        }          
        );

        if (!mp3Response.data.success) {
          throw new Error(mp3Response.data.error);
        }

        console.log("Mp4 => Mp3 변환 완료:", mp3Response );

        // 3. MP3 → STT
        // const sttResponse = await axios.post(
        //   `${API_URL}/api/convertMp3ToSTT`,
        //   {
        //     jobId,
        //     model,
        //     language,
        //   }
        // );

        // if (!sttResponse.data.success) {
        //   throw new Error(sttResponse.data.error);
        // }

        // console.log("STT 완료:", sttResponse.data);
      } catch (error) {
        handleError({
          title: "변환 실패",
          message:
            error.response?.data?.error ??
            error.message ??
            "처리 중 오류가 발생했습니다.",
        });
      }

    
  };

  const handleError = (errorObject) =>{

    if(onError ==null){
      console.log("onError initialize failed");
    }

    if(onError ===null){
      console.log("onError === initialize failed");
    }

    onError?.(errorObject);
  };



  return (
     <div className="stt-page">
       
      <div className="stt-layout">
        <section className="file-card">
          <h3>
            파일 목록 <span>(드래그 앤 드롭 가능)</span>
          </h3>

          <label className="drop-zone"
            className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <input
              type="file"
              accept="video/*,audio/*"
              multiple
              onChange={handleFileChange}
            />
            <div className="drop-icon">🎬</div>
            <p>클릭하거나 파일을 끌어다 놓으세요</p>
            <small>영상 / 오디오 (mp4, mov, webm, mp3, wav, m4a 등)</small>
          </label>

          <div className="file-list">
            {files.length === 0 ? (
              <p className="empty">등록된 파일 없음</p>
            ) : (
              files.map((file) => (
                <div className="file-item" key={file.name}>
                  <span>📄 {file.name}</span>
                  <small>{(file.size / 1024 / 1024).toFixed(1)}MB</small>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="setting-card">
          <h3>설정</h3>

          <div className="form-group">
            <label>모델 (정확도 ↔ 속도)</label>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="tiny">tiny</option>
              <option value="base">base</option>
              <option value="small">small (추천) ⭐</option>
              <option value="medium">medium</option>
            </select>
            <small>250MB · 보통 · 한국어 정확도 좋음</small>
          </div>

          <div className="form-group">
            <label>언어</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="ko">한국어</option>
              <option value="en">영어</option>
              <option value="ja">일본어</option>
              <option value="zh">중국어</option>
            </select>
            <small>영상의 주 언어를 선택하세요</small>
          </div>

          <div className="form-group">
            <label>출력 포맷</label>
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option value="srt">SRT (타임코드 포함, 영상편집용)</option>
              <option value="txt">TXT</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <button className="start-button" disabled={files.length === 0}
            onClick=
            {
              (e) =>{
                mp4ToSTT()
              }
            /*(e) => 
            uploadVideo(files[0],(data)=>{
              console.log(data.jobId);
            })*/ 
            }
          >
            자막 추출 시작 ({files.length}개)
          </button>

          <div className="guide-box">
            <h4>🎯 모델 선택 가이드</h4>

            <div className="guide-row">
              <strong>tiny</strong>
              <span>영어 간단한 영상 · 테스트용</span>
            </div>

            <div className="guide-row">
              <strong>base</strong>
              <span>영어 일반 영상 · 한/중/일 정확도 아쉬움</span>
            </div>

            <div className="guide-row">
              <strong>small ⭐</strong>
              <span>기본 추천 · 대부분 영상 OK</span>
            </div>

            <div className="guide-row">
              <strong>medium</strong>
              <span>한국어 정확도 높음 · 느림</span>
            </div>

            <hr />

            <p>💡 첫 실행 시 모델 다운로드 1~5분</p>
            <p>💡 Chrome · Edge 최신 버전 권장</p>
            <p>💡 언어 선택은 꼭 영상 실제 언어로!</p>
          </div>
        </section>
      </div>
    </div>
  );

}
