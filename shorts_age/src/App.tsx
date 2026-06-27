
import React, { useRef,useState } from 'react';
// import '../css/screen_videoToSTT.css';
import Sidebar,{MENU_KEYS} from "./widget/sidebar";

import ChannelRankingPage from './screen/channelRankingPage';
import GoldChannel from './screen/goldChannel';
import FilterVideo from './screen/filterVideo';
import LinkHam from './screen/linkHam';
import VideoToSTT from './screen/videoToSTT';
import ShortsTool from './screen/shortsVideoFrameTool';
import Setting from './screen/setting';

import ErrorPopup from './widget/errorPopup';

import './App.css'
import type { ErrorObject } from "./types/error";


// interface ErrorObject {
//   title: string;
//   message: string;
// }

function App() {
  
  const [activePage, setActivePage] = useState("home");

  const [errorTitle, setErrorTitle] = useState("");  
  const [errorMessage, setErrorMessage] = useState("");
  const handleError = (errorObject:ErrorObject) => {
    setErrorTitle(errorObject.title);
    setErrorMessage(errorObject.message);
  };

  return (
     <div style={{ display: "flex" }}>
      <Sidebar activePage={activePage} onMenuClick={setActivePage} />
        <main className="page-shell">

            {activePage === MENU_KEYS.HOME && <ChannelRankingPage/>}
            {activePage === MENU_KEYS.GOLD_CHANNEL && <GoldChannel/>}
            {activePage === MENU_KEYS.FILTER_VIDEO && <FilterVideo/>}
            {activePage === MENU_KEYS.LINK_HAM && <LinkHam/>}
            {activePage === MENU_KEYS.EXPORT_STT && <VideoToSTT onError={handleError}/>}
            {activePage === MENU_KEYS.SHORTS_TOOL && <ShortsTool/>}
            {activePage === MENU_KEYS.SETTING && <Setting/>}

             
            <ErrorPopup
              open={!!errorMessage}
              title={errorTitle}
              message={errorMessage}
              onClose={() => setErrorMessage("")}
            />
        </main>
      </div>
  );
}



export default App
