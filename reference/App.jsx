// import { Routes, Route, Link } from 'react-router-dom'
// import Help from './Help'
// import SSulFactory from './widget/SSulFactory'
// import './App.css'

// function SSulFactory() {
//   return (
//     <div className="youtube-ui">
//       <header className="header">
//         <div className="header-left">
//           <button className="menu-btn">☰</button>
//           <div className="logo">YouTube</div>
//         </div>
//         <div className="header-center">
//           <input type="text" placeholder="검색" className="search-input" />
//           <button className="search-btn">🔍</button>
//         </div>
//         <div className="header-right">
//           <button>📹</button>
//           <button>🔔</button>
//           <button>👤</button>
//         </div>
//       </header>
//       <div className="main-content">
//         <aside className="sidebar">
//           <ul>
//             <li><Link to="/">홈</Link></li>
//             <li><Link to="/help">도움말</Link></li>
//             <li>구독</li>
//             <li>라이브러리</li>
//             <li><Link to="/SSulFactory"> 썰쇼츠 공장</Link></li>
//             <li>라이브러리 1</li>
//             <li>라이브러리 2</li>
//             <li>라이브러리 3</li>
//             <li>라이브러리 4</li>
//             <li> 사용약관</li>
//             <li> 사용약관</li>
//             <li> 사용약관</li>
//             <li> 사용약관</li>
//             <li> 사용약관</li>

//             <li>라이브러리 1</li>
//             <li>라이브러리 2</li>
//             <li>라이브러리 3</li>
//             <li>라이브러리 4</li>
//             <li>라이브러리 1</li>
//             <li>라이브러리 2</li>
//             <li>라이브러리 3</li>
//             <li>라이브러리 4</li>
//             <li>라이브러리 1</li>
//             <li>라이브러리 2</li>
//             <li>라이브러리 3</li>
//             <li>라이브러리 4</li>
//             <li>라이브러리 1</li>
//             <li>라이브러리 2</li>
//             <li>라이브러리 3</li>
//             <li>라이브러리 4</li>
//             <li>라이브러리 1</li>
//             <li>라이브러리 2</li>
//             <li>라이브러리 3</li>
//             <li>라이브러리 4</li>
//             <li>라이브러리 1</li>
//             <li>라이브러리 2</li>
//             <li>라이브러리 3</li>
//             <li>라이브러리 4</li>
            
//           </ul>
//         </aside>
//         <main className="content">
//           <h1>썰쇼츠 공장</h1>
//           <p>여기에 썰쇼츠 공장 콘텐츠를 추가하세요.</p>
//         </main>
//       </div>
//     </div>
//   )
// }

import { Routes, Route, Link } from 'react-router-dom'
import Help from './Help'
import SSulFactory from './widget/SSulFactory'
import './App.css'
import { useState } from 'react'

function Home() {
  const [currentView, setCurrentView] = useState('home')

  return (
    <div className="youtube-ui">
      <header className="header">
        <div className="header-left">
          <button className="menu-btn">☰</button>
          <div className="logo">YouTube</div>
        </div>
        <div className="header-center">
          <input type="text" placeholder="검색" className="search-input" />
          <button className="search-btn">🔍</button>
        </div>
        <div className="header-right">
          <button>📹</button>
          <button>🔔</button>
          <button>👤</button>
        </div>
      </header>
      <div className="main-content">
        <aside className="sidebar">
          <ul>
            <li onClick={() => setCurrentView('home')}>홈</li>
            <li><Link to="/help">도움말</Link></li>
            <li onClick={() => setCurrentView('home')}> 구독</li>
            <li>라이브러리</li>
            <li onClick={() => setCurrentView('ssul')}> 썰쇼츠 공장</li>
            <li>라이브러리 1</li>
            <li>라이브러리 2</li>
            <li>라이브러리 3</li>
            <li>라이브러리 4</li>
            <li> 사용약관</li>
            <li> 사용약관</li>
            <li> 사용약관</li>
            <li> 사용약관</li>
            <li> 사용약관</li>

            <li>라이브러리 1</li>
            <li>라이브러리 2</li>
            <li>라이브러리 3</li>
            <li>라이브러리 4</li>
            <li>라이브러리 1</li>
            <li>라이브러리 2</li>
            <li>라이브러리 3</li>
            <li>라이브러리 4</li>
            <li>라이브러리 1</li>
            <li>라이브러리 2</li>
            <li>라이브러리 3</li>
            <li>라이브러리 4</li>
            <li>라이브러리 1</li>
            <li>라이브러리 2</li>
            <li>라이브러리 3</li>
            <li>라이브러리 4</li>
            <li>라이브러리 1</li>
            <li>라이브러리 2</li>
            <li>라이브러리 3</li>
            <li>라이브러리 4</li>
            <li>라이브러리 1</li>
            <li>라이브러리 2</li>
            <li>라이브러리 3</li>
            <li>라이브러리 4</li>
            
          </ul>
        </aside>
        <main className="content">
          { 
              currentView === 'ssul' ? <SSulFactory /> : (

              <div className="video-grid">
              <div className="video-card">
                <img src="https://via.placeholder.com/320x180" alt="Video" />
                <h3>비디오 제목 1</h3>
                <p>채널 이름</p>
              </div>
              <div className="video-card">
                <img src="https://via.placeholder.com/320x180" alt="Video" />
                <h3>비디오 제목 2</h3>
                <p>채널 이름</p>
              </div>
              { }
            </div>
            )
          }
          
          {/*currentView === 'home' ? (
            <div className="video-grid">
              <div className="video-card">
                <img src="https://via.placeholder.com/320x180" alt="Video" />
                <h3>비디오 제목 1</h3>
                <p>채널 이름</p>
              </div>
              <div className="video-card">
                <img src="https://via.placeholder.com/320x180" alt="Video" />
                <h3>비디오 제목 2</h3>
                <p>채널 이름</p>
              </div>
              { }
            </div>
          ) : (
            <SSulFactory />
          )} */}
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/help" element={<Help />} />
    </Routes>
  )
}

export default App
