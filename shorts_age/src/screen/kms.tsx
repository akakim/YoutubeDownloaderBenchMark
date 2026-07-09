import { useEffect } from 'react';
import '../styles/global.css';
import KMSWidget from '../widget/kmsWidget';

import { Button } from "@/components/ui/button"
type KMSScreenProps = {
  isKMSSUCCESS?: boolean
}

export default function KMSScreen({ isKMSSUCCESS = false }: KMSScreenProps) {


  return (

    <div className="screen">
      <h1> 나만의 API 키 관리자 </h1>

      <div className="large_widget">
      
        <Button  className="m-[10px] whitespace-nowrap" onClick={()=>{{
          console.log(`isKMSSUCCESS : ${isKMSSUCCESS}`)
        }}}>
            테스트용 버튼
        </Button>
            <KMSWidget isKMSSUCCESS={isKMSSUCCESS} />
      </div>
      
    </div>
  );

}
