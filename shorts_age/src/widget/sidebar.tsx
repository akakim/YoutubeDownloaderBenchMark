// Sidebar.jsx
import { useState } from "react";

import "../styles/widget/sidebar.css";

export const MENU_KEYS = {
  HOME: "home",
  GOLD_CHANNEL: "goldChannel",
  FILTER_VIDEO: "filterVideo",
  LINK_HAM: "linkHam",
  EXPORT_STT:"exportSTT",
  SHORTS_TOOL:"shortsTools",
  SETTING:"settings",
  ANALYZE_TOOL:"ANALYZE_TOOL"
} as const;


const menus = [
  ["🎯", "쇼츠헌터", MENU_KEYS.HOME],
  ["⭐", "황금채널",MENU_KEYS.GOLD_CHANNEL],
  ["⚖️", "영상 판별기",MENU_KEYS.FILTER_VIDEO],
  ["🔗", "링크함", MENU_KEYS.LINK_HAM],
  ["📝", "자막 추출기",MENU_KEYS.EXPORT_STT],
  ["🖼️", "쇼츠툴 제작기",MENU_KEYS.SHORTS_TOOL],
  ["📊","영상 분석 툴",MENU_KEYS.ANALYZE_TOOL],
  ["⚙️", "설정 (API 키)",MENU_KEYS.SETTING],
];

interface SidebarProps {
  activePage: string;
  onMenuClick: (page: string) => void;
}

export default function Sidebar({ activePage, onMenuClick }: SidebarProps) {

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">🐇</div>
        <div>
          <h1> 고양이의 </h1>
          <p>Shorts 시대</p>
        </div>
      </div>

      <nav className="menu">
        {menus.map(([icon, label, key, right]) => (

          <button
            key={label}
            className={`menu-item ${activePage === key ? "active" : ""}`}
            onClick={() => {onMenuClick(key)
                        console.log('select :' + key );
            }}
          >
            <span className="icon">{icon}</span>
            <span>{label}</span>
            {right && <span className="right">{right}</span>}
          </button>
        ))}
      </nav>

      <div className="profile">
        <div className="avatar">👤</div>
        <div>
          <strong>인터네시아만델링</strong>
          <p>mandelling@gmail.com</p>
        </div>
        <span>↩</span>
      </div>

      <div className="actions">
        <button className="red">📺 준위야쇼츠하자</button>
        <button className="green">🦘 캥거루스터디 카페</button>
      </div>

      <footer>
        © 주식회사 캣츠<br />
        본 사이트 및 출처는 주식회사 캣츠에 있습니다.
        <br />
        무단복제 · 변형 · 배포 금지
      </footer>
    </aside>
  );
}