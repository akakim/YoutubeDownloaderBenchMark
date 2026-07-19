import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { KMSFieldRow } from "@/types/kmsRow"
import type {RepositoryValue} from "@/repository/IRepository"
import { repository } from "@/repository/IRepository"
import type { RepositoryEntry } from "@/repository/IRepository"
import { Logger, LoggerShowing,indexedDBDebug } from "@/lib/LogUtil"


interface APIKeyWidgetProps {
  table:string,
  prefix:string,
  title:string,
  addButtonText:string
}



function createKMSRow(
  dServiceType: string,
  dAlias: string,
  dValue: string,
  uIsNew: boolean,
  uID:string
): KMSFieldRow {

  const dKmsID = `${dServiceType}:${dAlias}_${crypto.randomUUID()}`

  return {
    dKmsID: dKmsID,
    dServiceType,
    dAlias,
    dValue,
    uIsNew,
    uID
  }
}


export default function APIKeyWidget({
  table,
  prefix,
  title,
  addButtonText,
}: APIKeyWidgetProps) {
  
  /**StrictMode 자체를 제거할수도 있지만, 개발 중 오류 감지에 유용하므로 남겨둠.
   *  useState(loadKMSRows)를 다음 소스로 변경함. */

  const gptItemCount = useRef<number>(0) 
  const hasLoadedKMSRows = useRef(false)
  const [fieldRows, setFieldRows] = useState<KMSFieldRow[]>([])
  const [dAlias,setDalias] = useState("")
  const [apiKeyValue, setapiKeyValue] = useState("")

  
  useEffect(() => {
    if (hasLoadedKMSRows.current) {
      return
    }

    hasLoadedKMSRows.current = true
    loadKMSRows()
  }, [])

  async function loadKMSRows(): Promise<void> {
    try {
      const response: RepositoryEntry<RepositoryValue>[] =
        await repository.getAll<RepositoryValue>(table)

      LoggerShowing("loadKMSRow()",false)

      let rowCount = 0;
      const rows = response.flatMap<KMSFieldRow>((dbValue) => {
        
        LoggerShowing(`value: ${JSON.stringify(dbValue.value, null, 2)}`,false)

        const recordFromDB = dbValue.value
        if (
          typeof recordFromDB !== "object" ||
          recordFromDB === null ||
          Array.isArray(recordFromDB) ||
          typeof recordFromDB.dKmsID !== "string" ||
          typeof recordFromDB.dServiceType !== "string" ||
          typeof recordFromDB.dAlias !== "string" ||
          typeof recordFromDB.dValue !== "string" 

        ) {
          LoggerShowing(`loadKMSRow(): invalid row (${dbValue.key})`,true)
          return []
        }
        rowCount++;
        gptItemCount.current = rowCount;
        return [{
          dKmsID: recordFromDB.dKmsID,
          dServiceType: recordFromDB.dServiceType,
          dAlias: recordFromDB.dAlias,
          dValue: recordFromDB.dValue,
          uIsNew: false,
          uID:`${prefix}_${gptItemCount.current}`
        }]
      })

      setFieldRows(rows)
    } catch (error) {
      LoggerShowing(`loadKMSRow() ${error}`,true)
      setFieldRows([])
    }
  }

  function addGPTRow() {

    
    setFieldRows((prevRows) => [
      createKMSRow(
        table,
        dAlias,
        apiKeyValue,
        true,
        `${prefix}_${gptItemCount.current}`
      ),
      ...prevRows,
    ])

    gptItemCount.current++;
  }
  function putRowToRepo(row:KMSFieldRow,isNew:boolean){
    LoggerShowing(`d_dAlias : ${dAlias}`,false)
    LoggerShowing(`apiKeyValue : ${row.dValue}`,false)
    LoggerShowing(`dKmsID : ${row.dKmsID}`,false)

    const keys = ["dKmsID","dServiceType","dAlias","dValue"];
    const values = [row.dKmsID,row.dServiceType,row.dAlias,row.dValue];
    repository.bulkPut(table,row.dKmsID,keys,values);

    if( isNew ){
     changeNewToOldBtn(row.dKmsID);
    }
  }

  function removeLastGPTRow() {
    setFieldRows((prevRows) => prevRows.slice(1))

  }

  function removeGPTRow(dKmsID: string,isNew: boolean) {
    setFieldRows((prevRows) => prevRows.filter((row) => row.dKmsID !== dKmsID))

    if (!isNew) {
    const [tableName,recordID] = dKmsID.split(":")
     

    repository.remove(table,recordID).then((response)=>{
       LoggerShowing(`createKMSRow success`,false);
    }).catch((error)=>{
      LoggerShowing(`createKMSRow error: ${error}`,true);
    });
    }

  }

  function updateRowDAlias(dKmsID: string, dAlias: string) {
    LoggerShowing('updateRowdAlias()',false)
    setFieldRows((prevRows) => {
     
      const nextRows = prevRows.map((row) =>
                
        row.dKmsID === dKmsID
          ? {
              ...row,
              dAlias,
            }
          : row,
      )
      indexedDBDebug( nextRows.map((row) => ({
        uID: row.uID,
        dKmsID: row.dKmsID,
        dAlias: row.dAlias,
        dValue: row.dValue,
      })),false)

      return nextRows
    })
  }

  function updateRowValue(dKmsID: string, value: string) {
    LoggerShowing('updateRowValue()',true)
    setFieldRows((prevRows) =>
      prevRows.map((row) =>
        row.dKmsID === dKmsID
          ? {
              ...row,
              dValue:value,
            }
          : row,
      ),
    )
  }

  function changeNewToOldBtn( dKmsID: string){
    setFieldRows((prevRows) =>
        prevRows.map((fieldRow) =>
          fieldRow.dKmsID === dKmsID
            ? { ...fieldRow, uIsNew: false }
            : fieldRow,
        ),
      )
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4 flex flex-nowrap items-center gap-2 overflow-x-auto">
        <Button
          className="m-[10px] whitespace-nowrap"
          onClick={addGPTRow}
        >
          {addButtonText}
        </Button>         
        
      </div>

      <form className="space-y-8">
        <FieldGroup>
          <FieldSet>
            <Field>
                <FieldLegend>{title}</FieldLegend>
                <Input
                    id="dAlias"
                    placeholder="키의 별칭"
                    value={dAlias}
                    onChange={(e) => setDalias(e.target.value)}
                />
                <Input
                    id="api-key"
                    placeholder="GPT API Key 입력"
                    value={apiKeyValue}
                    onChange={(e) => setapiKeyValue(e.target.value)}
                />
            </Field>
            <FieldGroup>
              {fieldRows.map((row,index) => (
                <Field key={row.uID} orientation="vertical">
                  

                  <div className="flex gap-2">

                    <Input
                      id={`${index}-alias`}
                      value={row.dAlias}
                      placeholder="키의 별칭"
                      onChange={(e) => updateRowDAlias(row.dKmsID, e.target.value)}
                    />

                    <Input
                      id={`${index}-value`}
                      value={row.dValue}
                      placeholder="키 값"
                      onChange={(e) => updateRowValue(row.dKmsID, e.target.value)}
                    />

                    
                    {(row.uIsNew)? 
                      <Button
                        id={`${index}-btn-add`}
                        variant="outline"
                        type="button"
                        onClick={() => putRowToRepo(row,row.uIsNew)}
                      >
                      키 더하기 
                      </Button>                    
                    : 
                     <Button
                       id={`${index}-btn-update`}
                        variant="outline"
                        type="button"
                        onClick={() => putRowToRepo(row,row.uIsNew)}
                      >
                        키 값 업데이트 
                      </Button>
                      }
             

                      <Button
                        id={`${index}-btn-remove`}
                        variant="outline"
                        type="button"
                        onClick={() => removeGPTRow(row.dKmsID,row.uIsNew)}
                      >
                        Remove
                      </Button>

                    
                  </div>
                </Field>
              ))}
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
      </form>
    </div>
  )
}
