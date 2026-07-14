import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { KMSRow,KMSFieldRow } from "@/types/kmsRow"
import { GPT_PREFIX,GPT_TABLE } from "@/types/kmsRow"
import type { KMSScreenProps } from "@/screen/kms";
import type {RepositoryValue} from "@/repository/IRepository"
import { repository } from "@/repository/IRepository"
import type { RepositoryEntry } from "@/repository/IRepository"


import { Logger, LoggerShowing } from "@/lib/LogUtil"



function createKMSRow(
  serviceType: string,
  dAlias: string,
  value: string,
  u_isNew: boolean,
  u_id:string
): KMSFieldRow {

  const kmsID = `${serviceType}_${dAlias}_${crypto.randomUUID()}`

  return {
    kmsID: kmsID,
    serviceType,
    dAlias,
    value,
    u_isNew,
    u_id
  }
}


export default function KSMGPTWidget({ isKMSSUCCESS = false }: KMSScreenProps) {
  
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
        await repository.getAll<RepositoryValue>(GPT_TABLE)

      Logger("loadKMSRow()")

      let rowCount = 0;
      const rows = response.flatMap<KMSFieldRow>((dbValue) => {
        
        Logger(`value: ${JSON.stringify(dbValue.value, null, 2)}`)

        const value = dbValue.value
        if (
          typeof value !== "object" ||
          value === null ||
          Array.isArray(value) ||
          typeof value.kmsID !== "string" ||
          typeof value.serviceType !== "string" ||
          typeof value.dAlias !== "string" ||
          typeof value.value !== "string" 

        ) {
          Logger(`loadKMSRow(): invalid row (${dbValue.key})`)
          return []
        }
        rowCount++;
        gptItemCount.current = rowCount;
        return [{
          kmsID: value.kmsID,
          serviceType: value.serviceType,
          dAlias: value.dAlias,
          value: value.value,
          u_isNew: false,
          u_id:`${GPT_PREFIX}_${rowCount}`
        }]
      })

      setFieldRows(rows)
    } catch (error) {
      Logger(`loadKMSRow() ${error}`)
      setFieldRows([])
    }
  }

  function addGPTRow() {

    
    setFieldRows((prevRows) => [
      createKMSRow(
        GPT_TABLE,
        dAlias,
        apiKeyValue,
        true,
        String(gptItemCount.current.valueOf())
      ),
      ...prevRows,
    ])

  
  }
  function putRowToRepo(row:KMSFieldRow){
    LoggerShowing(`d_dAlias : ${dAlias}`,false)
    LoggerShowing(`apiKeyValue : ${row.value}`,true)
    LoggerShowing(`kmsID : ${row.kmsID}`,true)

    const keys = ["kmsID","serviceType","dAlias","value"];
    const values = [row.kmsID,row.serviceType,row.dAlias,row.value];
    repository.bulkPut(GPT_TABLE,row.kmsID,keys,values);

     changeNewToOldBtn(row.kmsID);
  }

  function removeLastGPTRow() {
    setFieldRows((prevRows) => prevRows.slice(1))

  }

  function removeGPTRow(kmsID: string) {
    setFieldRows((prevRows) => prevRows.filter((row) => row.kmsID !== kmsID))

    repository.remove(GPT_TABLE,kmsID).then((response)=>{

    LoggerShowing(`createKMSRow success`,false);
    }).catch((error)=>{

      LoggerShowing(`createKMSRow error: ${error}`,false);
    });

  }

  function updateRowDAlias(kmsID: string, dAlias: string) {
    LoggerShowing('updateRowdAlias()',true)
    setFieldRows((prevRows) =>
     
      prevRows.map((row) =>
                
        row.kmsID === kmsID
          ? {
              ...row,
              dAlias,
            }
          : row,
        console.log(
          prevRows.map((r) => ({
            u_id: r.u_id,
            kmsID: r.kmsID,
            dAlias: r.dAlias,
            value: r.value,
          })),
        )
      ),
      
    )
  }

  function updateRowValue(kmsID: string, value: string) {
    LoggerShowing('updateRowValue()',true)
    setFieldRows((prevRows) =>
      prevRows.map((row) =>
        row.kmsID === kmsID
          ? {
              ...row,
              value,
            }
          : row,
          console.log(
          prevRows.map((r) => ({
            u_id: r.u_id,
            kmsID: r.kmsID,
            dAlias: r.dAlias,
            value: r.value,
          })),
        )
      ),
    )
  }

  function changeNewToOldBtn( kmsID: string){
    setFieldRows((prevRows) =>
        prevRows.map((fieldRow) =>
          fieldRow.kmsID === kmsID
            ? { ...fieldRow, isNew: false }
            : fieldRow,
        ),
      )
  }

  function isExistAPIKey(kmsID:string){

    let isExist = false;
    const res = repository.get(GPT_TABLE,kmsID).then((response)=>{
      Logger(`isExistAPIKey response : ${response}`);      
      if( response ){
        isExist = true;
      }
      return response
    })
    
    .catch( () => {
      Logger(`isExistAPIKey error : `);
       return ''
    });

    return isExist;

  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4 flex flex-nowrap items-center gap-2 overflow-x-auto">
        <Button
          className="m-[10px] whitespace-nowrap"
          onClick={addGPTRow}
        >
          Add Chat GPT
        </Button>
        
        <Button
          className="m-[10px] whitespace-nowrap"
          onClick={removeLastGPTRow}
        >
          Remove Chat GPT
        </Button>
        
      </div>

      <form className="space-y-8">
        <FieldGroup>
          <FieldSet>
            <Field>
                <FieldLegend>GPT API Key 관리</FieldLegend>
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
                <Field key={row.u_id} orientation="vertical">
                  <FieldLabel
                    htmlFor={`${row.dAlias}-value`}
                    className="m-[10px] min-w-[160px] whitespace-nowrap"
                  >
                    {row.serviceType}
                  </FieldLabel>

                  <div className="flex gap-2">

                    <Input
                      id={`${index}-alias`}
                      value={row.dAlias}
                      placeholder="키의 별칭"
                      onChange={(e) => updateRowDAlias(row.kmsID, e.target.value)}
                    />

                    <Input
                      id={`${index}-value`}
                      value={row.value}
                      placeholder="키 값"
                      onChange={(e) => updateRowValue(row.kmsID, e.target.value)}
                    />

                    

             
                    {
                    row.u_isNew&&
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => putRowToRepo(row)}
                      >
                        키 더하기 
                      </Button>
                    }
                    {
                    !row.u_isNew&&
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => putRowToRepo(row)}
                      >
                        키 값 업데이트 
                      </Button>
                    }


                    {
                    !row.u_isNew&&
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => removeGPTRow(row.kmsID)}
                      >
                        Remove
                      </Button>
                    }

                    
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
