import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { KMSRow } from "@/types/kmsRow"
import { GPT_PREFIX,GPT_TABLE } from "@/types/kmsRow"
import type { KMSScreenProps } from "@/screen/kms";
import type {RepositoryValue} from "@/repository/IRepository"
import { repository } from "@/repository/IRepository"
import type { RepositoryEntry } from "@/repository/IRepository"


import { Logger } from "@/lib/LogUtil"



function createKMSRow(
  serviceType: string,
  alias: string,
  value: string,
): KMSRow {

  const kmsID = `${serviceType}_${alias}_${crypto.randomUUID()}`

  return {
    kmsID: kmsID,
    serviceType,
    alias,
    value,
  }
}


export default function KSMGPTWidget({ isKMSSUCCESS = false }: KMSScreenProps) {
  const [savedRows,setSavedRows] = useState(loadKMSRows)
  const [fieldRows, setFieldRows] = useState<KMSRow[]>([])
  const [alias,setAlias] = useState("")
  const [apiKeyValue, setapiKeyValue] = useState("")

  function loadKMSRows(): any {


      const savedRows = repository.getAll<string>(GPT_TABLE).then(
       (response: RepositoryEntry<string>[]) => {
        
        let idx = 0;
         
        Logger(`loadKMSRow()`)
        Logger(`key: ${response[0]?.key}`)
        Logger(`value: ${response[0]?.value}`)
        
        
        
        return response
      }).catch((error)=>{
        Logger(`loadKMSRow() ${error}`)
        return [];
      }).finally(()=>{
        return [];
      });
  }

  function addGPTRow() {

    
    setFieldRows((prevRows) => [
      createKMSRow(
        GPT_TABLE,
        alias,
        apiKeyValue,
      ),
      ...prevRows,
    ])

  
  }
  function putRowToRepo(row:KMSRow){
    Logger(`alias : ${alias}`)
    Logger(`apiKeyValue : ${row.value}`)
    Logger(`kmsID : ${row.kmsID}`)

    const keys = ["kmsID","serviceType","alias","value"];
    const values = [row.kmsID,row.serviceType,row.alias,row.value];
    repository.bulkPut(GPT_TABLE,keys,values);

    // repository.put(GPT_TABLE,row.kmsID,row.value).then((response)=>{

    //   Logger(`createKMSRow success: ${response}`);
    // }).catch((error) => {

    //   Logger(`createKMSRow error: ${error}`);
    // });
  }

  function removeLastGPTRow() {
    setFieldRows((prevRows) => prevRows.slice(1))

  }

  function removeGPTRow(kmsID: string) {
    setFieldRows((prevRows) => prevRows.filter((row) => row.kmsID !== kmsID))

    repository.remove(GPT_TABLE,kmsID).then((response)=>{

    Logger(`createKMSRow success`);
    }).catch((error)=>{

      Logger(`createKMSRow error: ${error}`);
    });

  }

  function updateRow(kmsID: string, value: string) {
    setFieldRows((prevRows) =>
      prevRows.map((row) =>
        row.kmsID === kmsID
          ? {
              ...row,
              value,
            }
          : row,
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
                    id="alias"
                    placeholder="키의 별칭"
                    value={alias}
                    onChange={(e) => setAlias(e.target.value)}
                />
                <Input
                    id="api-key"
                    placeholder="GPT API Key 입력"
                    value={apiKeyValue}
                    onChange={(e) => setapiKeyValue(e.target.value)}
                />
            </Field>
            <FieldGroup>
              {fieldRows.map((row) => (
                <Field key={row.alias} orientation="vertical">
                  <FieldLabel
                    htmlFor={`${row.alias}-value`}
                    className="m-[10px] min-w-[160px] whitespace-nowrap"
                  >
                    {row.serviceType}
                  </FieldLabel>

                  <div className="flex gap-2">
                    <Input
                      id={`${row.kmsID}-alias`}
                      value={row.alias}
                      placeholder="키의 별칭"
                      onChange={(e) => updateRow(row.kmsID, e.target.value)}
                    />

                    <Input
                      id={`${row.kmsID}-value`}
                      value={row.value}
                      placeholder="키 값"
                      onChange={(e) => updateRow(row.kmsID, e.target.value)}
                    />

                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => putRowToRepo(row)}
                    >
                      수정하기 
                    </Button>

                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => removeGPTRow(row.kmsID)}
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
