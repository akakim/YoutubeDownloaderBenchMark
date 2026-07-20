import '../styles/screen_videoToSTT.css';
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { aiServerClient } from "../network/apiClient";

export default function DownloadTestWidget(){

    const [testJobID,setTestJobID] = useState("")
    const [isDownloading, setIsDownloading] = useState(false)

    async function downloadSomething(){
        if (!testJobID.trim()) {
            alert("Job ID를 입력해주세요.")
            return
        }

        try {
            setIsDownloading(true)

          
          const downLoadResult = aiServerClient.post(
            "/downloadTester",{
                job_id:testJobID 
            }, {
                responseType: "blob",
            },).then((response)=>{
                console.log(`/stt res : ${response.data}`)
                 const disposition = response.headers["content-disposition"]

                const blob = new Blob(
                    [response.data],
                    { type: "application/x-subrip;charset=utf-8" },
                )

                return response
            })



            // const downloadUrl = URL.createObjectURL(blob)
            // const link = document.createElement("a")

            // link.href = downloadUrl
            // link.download = `translation_${testJobID}.srt`

            // document.body.appendChild(link)
            // link.click()
            // link.remove()

            // URL.revokeObjectURL(downloadUrl)
            
    
           
        } catch (error) {
                console.error("SRT 다운로드 실패:", error)
                alert("SRT 파일을 다운로드하지 못했습니다.")
        } finally {
            setIsDownloading(false)
        }

    }


    return (
         <div className="flex gap-2">
        
            <Input
                id="testJobID"
                value={testJobID}
                onChange={ (e)=>setTestJobID(e.target.value)}>

            </Input>
           
          <Button   
            onClick={() => {
            void downloadSomething();
            }}>
               {isDownloading ? "다운로드 중..." : "다운로드"}
            </Button>
        </div>
      );
}