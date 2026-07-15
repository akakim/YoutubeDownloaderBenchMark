import '../styles/global.css';

import APIKeyWidget from '../widget/APIKeyWidget';


import { API_KEY_TYPES } from "@/types/kmsRow"
export type KMSScreenProps = {
  isKMSSUCCESS?: boolean
}

export default function KMSScreen(_props: KMSScreenProps) {


  return (

    <div className="screen">
      <h1> 나만의 API 키 관리자 </h1>

      <div className="large_widget">
      
        
        <APIKeyWidget
          table={API_KEY_TYPES[0].table}
          prefix={API_KEY_TYPES[0].prefix}
          title={API_KEY_TYPES[0].label}
          addButtonText={API_KEY_TYPES[0].addButtonText}
        />

        <APIKeyWidget
          table={API_KEY_TYPES[1].table}
          prefix={API_KEY_TYPES[1].prefix}
          title={API_KEY_TYPES[1].label}
          addButtonText={API_KEY_TYPES[1].addButtonText}
        />

        <APIKeyWidget
          table={API_KEY_TYPES[2].table}
          prefix={API_KEY_TYPES[2].prefix}
          title={API_KEY_TYPES[2].label}
          addButtonText={API_KEY_TYPES[2].addButtonText}
        />
      </div>
      
    </div>
  );

}
