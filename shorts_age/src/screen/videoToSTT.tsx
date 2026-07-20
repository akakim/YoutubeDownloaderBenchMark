import React, { useState } from 'react';
import {apiClient,aiServerClient} from "../network/apiClient";

import '../styles/screen_videoToSTT.css';
import '../lib/region';

import type { ErrorObject } from "../types/error";
import { REGION_OPTIONS } from '../lib/region';

import { Button } from "@/components/ui/button";
// import DownloadTestWidget from "@/widget/DownloadTestWidget";
import DownloadTestWidget from '@/widget/downloadTestWidget';

interface VideoToSTTProps {
  onError?: (errorObject: ErrorObject) => void;
}

async function uploadVideo(file: File) {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("file_name", file.name);

  console.log('file : ', file);

  const uploadResponse = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return uploadResponse.data
}

export default function VideoToSTT({ onError }: VideoToSTTProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [model, setModel] = useState("small");
  const [language, setLanguage] = useState("ko");
  const [format, setFormat] = useState("srt");
  const [isDragging, setIsDragging] = useState(false);
  const [convertStatus,setConvertStatus] = useState("None");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files ?? []);
  };

  const addFiles = (fileList: FileList | File[]) => {
    const selected = Array.from(fileList ?? []);
    if (selected.length === 0) return;

    setFiles([selected[0]]);
    setConvertStatus("None");
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    addFiles(e.dataTransfer.files);
  };

  const mp4ToSTT = async () => {
    if (files.length === 0) {
      handleError({
        title: "파일 없음",
        message: "먼저 파일을 등록하세요.",
      });
      return;
    }

    try {
      const uploadResult = await uploadVideo(files[0]);
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }

      const jobId = uploadResult.jobId;
      const mp3Response = await apiClient.post("/api/convertMp4ToMp3", { jobId })
      .then((response)=>{

        aiServerClient.post("/stt",{job_id:jobId,model:model,language:language}).then((response)=>{
          console.log(`/stt res : ${response.data}`)
        })

        return response
      });

      if (!mp3Response.data.success) {
        throw new Error(mp3Response.data.error);
      }

      console.log("Mp4 => Mp3 변환 완료:", mp3Response);
    } catch (error) {

      handleError(error);

    }
  };

  const handleError = (error: unknown) => {
    //  const message =
    //   error instanceof Error
    //     ? error.message
    //     : "처리 중 오류가 발생했습니다.";

    let message = "";

    if ( error instanceof Error ){
        message = "처리 중 오류가 발생했습니다. " + error.message
    } else {
       message = "알 수 없는 오류가 발생했습니다."
    }

    const normalizedError: ErrorObject = {
      title: "파일 업로드 실패",
      message,
    };

    onError?.(normalizedError);
  };


  return (
     <div className="screen">
       
      <div className="widget">
        <section className="file-card">
          <h3>
            파일 목록 <span>(드래그 앤 드롭 가능)</span>
          </h3>

          <label
            className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              accept="video/*,audio/*"
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
                <div className="file-item" key={`${file.name}-${file.size}`}>
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
              <option value="large-v3"> large-v3</option>
              <option value="large-v3-turbo">large-v3-turbo (추천) ⭐</option>
              <option value="distil-large-v3">distil-large-v3</option>
            </select>
            <small>large-v3-turbo 가장 빠름</small>
          </div>

          <div className="form-group">
            <label>언어</label>

             
             
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              {REGION_OPTIONS.slice(1,5).map((region) => (
                          <option
                            key={region.ISO_639_1_value}
                            value={region.ISO_639_1_value}
                          >
                            {region.label}
                          </option>
                        ))}
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

          <Button   
            disabled={files.length === 0}
            onClick={() => {
              void mp4ToSTT();
            }}
          >
            자막 추출 시작 ({files.length}개)
          </Button>


          <DownloadTestWidget></DownloadTestWidget>
          

          <div className="guide-box">
            <h4>🎯 모델 선택 가이드</h4>

            <hr />

            <p>💡 Chrome · Edge 최신 버전 권장</p>
            <p>💡 언어 선택은 꼭 영상 실제 언어로!</p>
          </div>
        </section>
      </div>
    </div>
  );

}
