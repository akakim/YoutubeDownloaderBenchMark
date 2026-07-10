
import React, { useEffect,useRef,useState } from 'react';
import { repository } from "@/repository/IRepository"

// import '../css/screen_videoToSTT.css';
import Sidebar,{MENU_KEYS} from "./widget/sidebar";
import ChannelRankingScreen from './screen/channelRankingScreen';
import KeywordSearchScreen from './screen/keywordSearchScreen';

import GoldChannel from './screen/goldChannel';
import FilterVideo from './screen/filterVideo';
import LinkHam from './screen/linkHam';
import VideoToSTT from './screen/videoToSTT';
import AnalyzeGoodvideo from './screen/analyzeGoodvideo';
import ShortsTool from './screen/analyzeGoodvideo';
import Setting from './screen/setting';
import ErrorPopup from './widget/errorPopup';

import './App.css'
import type { ErrorObject } from "./types/error";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar,sideBarData } from "./components/app-sidebar"
import AdvancedSceneMaker from './screen/advancedSceneMaker';
import SceneMaker from './screen/sceneMaker';
import KMSScreen from './screen/kms';

// interface ErrorObject {
//   title: string;
//   message: string;
// }

// function App() {
  
//   const [activePage, setActivePage] = useState("home");
//   const [errorTitle, setErrorTitle] = useState("");  
//   const [errorMessage, setErrorMessage] = useState("");
//   const handleError = (errorObject:ErrorObject) => {
//     setErrorTitle(errorObject.title);
//     setErrorMessage(errorObject.message);
//   };

//   return (
//      <div style={{ display: "flex" }}>
//       <Sidebar activePage={activePage} onMenuClick={setActivePage} />
//         <main className="page-shell">

//             {activePage === MENU_KEYS.HOME && <ChannelRankingPage/>}
//             {activePage === MENU_KEYS.GOLD_CHANNEL && <GoldChannel/>}
//             {activePage === MENU_KEYS.FILTER_VIDEO && <FilterVideo/>}
//             {activePage === MENU_KEYS.LINK_HAM && <LinkHam/>}
//             {activePage === MENU_KEYS.EXPORT_STT && <VideoToSTT onError={handleError}/>}
//             {activePage === MENU_KEYS.SHORTS_TOOL && <ShortsTool/>}
//             {activePage === MENU_KEYS.SETTING && <Setting/>}

             
//             <ErrorPopup
//               open={!!errorMessage}
//               title={errorTitle}
//               message={errorMessage}
//               onClose={() => setErrorMessage("")}
//             />
//         </main>
//       </div>
//   );
// }


export function App() {

  const KMS_INIT_SUCCESS = 0x001; // 0001
  const REQUEST2_SUCCESS = 0x002; // 0010
  const REQUEST3_SUCCESS = 0x004; // 0100
  const REQUEST4_SUCCESS = 0x008; // 1000

  const [activeUrl, setActiveUrl] = useState("/")
  const [status, setStatus] = useState(0);

  useEffect(() => {
    async function initApp() {
      await repository.getAll("kms")
        .then(()=>{
          setStatus(prev => prev | KMS_INIT_SUCCESS)
        })
        .catch(()=>{


        })        
    }

    initApp()
  }, [])

  function isKMSSUCCESS(){
    return (status&KMS_INIT_SUCCESS) ? true : false ;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "20rem",
          "--sidebar-width-mobile": "20rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar onMenuClick={setActiveUrl} />

      <main>
        <SidebarTrigger >
        </SidebarTrigger>

        {activeUrl === sideBarData.navMain[0].items?.[0]?.url && <KeywordSearchScreen/>}
        {activeUrl === sideBarData.navMain[0].items?.[1]?.url && <ChannelRankingScreen/>}
        {activeUrl === sideBarData.navMain[1].items?.[0]?.url && <VideoToSTT/>}
        {activeUrl === sideBarData.navMain[1].items?.[1]?.url && <AnalyzeGoodvideo/>}
        {activeUrl === sideBarData.navMain[2].items?.[0]?.url && <SceneMaker/>}
        {activeUrl === sideBarData.navMain[2].items?.[1]?.url && <AdvancedSceneMaker/>}
        {activeUrl === sideBarData.navMain[3].items?.[0]?.url && <KMSScreen isKMSSUCCESS={isKMSSUCCESS()} />}

        {activeUrl === MENU_KEYS.FILTER_VIDEO && <FilterVideo/>}
        <h1>{activeUrl}에 온걸 환영합니다</h1>
      </main>

    </SidebarProvider>
  )
}
export default App
