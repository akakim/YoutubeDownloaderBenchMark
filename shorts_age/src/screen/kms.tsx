import { useEffect } from 'react';
import '../styles/global.css';
import KMSYoutubeDataAPIV3Widget from '../widget/kmsYoutubeDataAPIV3Widget';
import KMSGPTWidget from '../widget/kmsGPTWidget';
// import kmsGeminiWidget from '../widget/kmsGeminiWidget';

import { Button } from "@/components/ui/button"
export type KMSScreenProps = {
  isKMSSUCCESS?: boolean
}

export default function KMSScreen({ isKMSSUCCESS = false }: KMSScreenProps) {


  return (

    <div className="screen">
      <h1> 나만의 API 키 관리자 </h1>

      <div className="large_widget">
      
        
        <KMSGPTWidget isKMSSUCCESS={isKMSSUCCESS} />

        <KMSYoutubeDataAPIV3Widget isKMSSUCCESS={isKMSSUCCESS} />
      </div>
      
    </div>
  );

}
