import { useState } from "react";
import "../styles/widget/ApiKeyBox.css";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import {Button } from "@/components/ui/button"

export default function ApiKeyBox() {
  const [isAdding, setIsAdding] = useState(false);
  const [alias, setAlias] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleAdd = () => {
    if (!apiKey.trim()) return alert("API 키를 입력해주세요.");

    console.log({
      alias,
      apiKey,
    });

    setAlias("");
    setApiKey("");
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <Button onClick={() => setIsAdding(true)} >
        키 추가
      </Button>
    );
  }

  return (
    <div className="api-key-form">
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
          <Button>+ 키 추가</Button>
          <Button>발급방법</Button>
          <Button variant="ghost">📺 영상 가이드</Button>
        </div>
      </div>

      <input
        value={alias}
        onChange={(e) => setAlias(e.target.value)}
        placeholder="별칭 (예: 메인키)"
        className="api-input alias-input"
      />

      <input
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="AIza... 로 시작하는 API 키"
        className="api-input key-input"
      />

      <Button onClick={() => setIsAdding(false)}>
        취소
      </Button>

      <Button onClick={handleAdd}>
        추가
      </Button>
    </div>
  );
}