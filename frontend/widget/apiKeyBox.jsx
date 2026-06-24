import { useState } from "react";
import "../css/widget/ApiKeyBox.css";

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
      <button className="add-key-btn" onClick={() => setIsAdding(true)}>
        키 추가
      </button>
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
          <button>+ 키 추가</button>
          <button>발급방법</button>
          <button className="guideBtn">📺 영상 가이드</button>
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

      <button className="cancel-btn" onClick={() => setIsAdding(false)}>
        취소
      </button>

      <button className="add-btn" onClick={handleAdd}>
        추가
      </button>
    </div>
  );
}