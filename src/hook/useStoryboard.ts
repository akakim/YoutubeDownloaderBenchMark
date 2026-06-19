import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import type { Cut } from '../types';
import { generateImage } from '../services/dalle';

const SAMPLE_PROMPTS = [
  'A young girl discovers a glowing door in the middle of a sunlit meadow, wide shot, bright and dreamy',
  'Close-up of her curious expression, golden light reflecting in her eyes',
  'She steps through the door into a vibrant fantasy city floating in the clouds, panoramic view',
  'She meets a small flying fox with silver wings, both smiling, warm afternoon light',
];

function makeCuts(count: number): Cut[] {
  return Array.from({ length: count }, (_, i) => ({
    id: nanoid(),
    index: i,
    prompt: SAMPLE_PROMPTS[i] ?? '',
    imageUrl: null,
    loading: false,
    error: null,
  }));
}

export function useStoryboard() {
  const [cuts, setCuts] = useState<Cut[]>(() => makeCuts(4));
  const [apiKey, setApiKey] = useState('');
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const setCutCount = useCallback((count: number) => {
    setCuts(makeCuts(Math.min(12, Math.max(1, count))));
    setStatusMessage('');
  }, []);

  const updatePrompt = useCallback((id: string, prompt: string) => {
    setCuts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, prompt } : c))
    );
  }, []);

  const clearCut = useCallback((id: string) => {
    setCuts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, imageUrl: null, error: null } : c
      )
    );
  }, []);

  const generateOne = useCallback(
    async (id: string) => {
      if (!apiKey.trim()) {
        alert('OpenAI API 키를 입력해 주세요.');
        return;
      }

      const cut = cuts.find((c) => c.id === id);
      if (!cut?.prompt.trim()) {
        alert('프롬프트를 입력해 주세요.');
        return;
      }

      setCuts((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, loading: true, error: null } : c
        )
      );

      try {
        const url = await generateImage({ prompt: cut.prompt, apiKey });
        setCuts((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, imageUrl: url, loading: false } : c
          )
        );
      } catch (e) {
        const message = e instanceof Error ? e.message : '알 수 없는 오류';
        setCuts((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, loading: false, error: message } : c
          )
        );
      }
    },
    [apiKey, cuts]
  );

  const generateAll = useCallback(async () => {
    if (!apiKey.trim()) {
      alert('OpenAI API 키를 입력해 주세요.');
      return;
    }

    setIsGeneratingAll(true);
    for (let i = 0; i < cuts.length; i++) {
      setStatusMessage(`${i + 1} / ${cuts.length} 컷 생성 중...`);
      await generateOne(cuts[i].id);
    }
    setStatusMessage(`완료! ${cuts.length}컷 모두 생성됐습니다.`);
    setIsGeneratingAll(false);
  }, [apiKey, cuts, generateOne]);

  return {
    cuts,
    apiKey,
    setApiKey,
    setCutCount,
    updatePrompt,
    clearCut,
    generateOne,
    generateAll,
    isGeneratingAll,
    statusMessage,
  };
}
