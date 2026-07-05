import React, { useRef,useState } from 'react';
import '../styles/screen_videoToSTT.css';
import { AnalyzeWidget } from '../widget/analyzeWidget';

export default function AnalyzeGoodvideo() {
//   const [activeMenu,setActiveMenu] = useState("Home");

 return (
     <div className="screen">

        <h1 className="text-2xl font-bold mb-4"> 내 비디오에는 어떤 요소를 넣었는가 </h1>

        <div className="larget_widget">

            <AnalyzeWidget>
            </AnalyzeWidget>
        </div>

      </div>
  )

}