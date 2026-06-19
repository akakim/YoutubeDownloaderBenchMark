// import React from 'react';
import type { Cut } from '../types';
// import styles from './CutCard.module.css';
import styles from './CutCard.module.css';
interface Props {
  cut: Cut;
  onPromptChange: (id: string, value: string) => void;
  onGenerate: (id: string) => void;
  onClear: (id: string) => void;
  isGeneratingAll: boolean;
}

export function CutCard({
  cut,
  onPromptChange,
  onGenerate,
  onClear,
  isGeneratingAll,
}: Props) {
  const isDisabled = cut.loading || isGeneratingAll;

  return (
    <div className={styles.card}>
      {/* Image area */}
      <div className={styles.imageArea}>
        <span className={styles.badge}>
          CUT {String(cut.index + 1).padStart(2, '0')}
        </span>

        {cut.loading && (
          <div className={styles.loadingState}>
            <span className={styles.spinner} />
            <span className={styles.loadingText}>생성 중...</span>
          </div>
        )}

        {!cut.loading && cut.imageUrl && (
          <img
            src={cut.imageUrl}
            alt={`Cut ${cut.index + 1}`}
            className={styles.image}
          />
        )}

        {!cut.loading && !cut.imageUrl && !cut.error && (
          <div className={styles.placeholder}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>이미지 없음</span>
          </div>
        )}

        {!cut.loading && cut.error && (
          <div className={styles.placeholder}>
            <span className={styles.errorBadge}>오류 발생</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.bodyTop}>
          <span className={styles.cutTitle}>씬 {cut.index + 1}</span>
          <span className={styles.cutMeta}>DALL-E 3 · 1792×1024</span>
        </div>

        <textarea
          className={styles.textarea}
          value={cut.prompt}
          onChange={(e) => onPromptChange(cut.id, e.target.value)}
          placeholder="장면을 영어로 묘사하세요 (예: A hero walks through a foggy street at dawn, cinematic)"
          disabled={isDisabled}
        />

        {cut.error && (
          <p className={styles.errorNote}>{cut.error.slice(0, 120)}</p>
        )}

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => onGenerate(cut.id)}
            disabled={isDisabled}
          >
            생성
          </button>
          <button
            className={styles.btn}
            onClick={() => onClear(cut.id)}
            disabled={isDisabled}
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
