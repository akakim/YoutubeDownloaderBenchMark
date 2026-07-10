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

const GPT_PREFIX = "gpt-key-"
const GEMINI_PREFIX = "gemini-key-"
const YOUTUBE_DATA_API_V3_PREFIX = "youtube-data-api-v3-"
const KMS_STORAGE_KEY = "kms-rows"

function createKMSRow(
  serviceType: string,
  aliasPrefix: string,
  value: string,
  index: number,
): KMSRow {
  return {
    serviceType,
    alias: `${aliasPrefix}${String(index)}`,
    value,
  }
}

type KMSWidgetProps = {
  isKMSSUCCESS?: boolean
}

export default function KSMWidget({ isKMSSUCCESS = false }: KMSWidgetProps) {
  const [fieldRows, setFieldRows] = useState<KMSRow[]>(loadKMSRows)
  const [fieldLabel, setFieldLabel] = useState("")
  const isDisabled = !isKMSSUCCESS
  function loadKMSRows(): KMSRow[] {
        const savedRows = localStorage.getItem(KMS_STORAGE_KEY)

        if (!savedRows) {
            return []
        }

        try {
            return JSON.parse(savedRows) as KMSRow[]
        } catch {
            return []
        }
    }

  function addGPTRow() {
    setFieldRows((prevRows) => [
      createKMSRow(
        "Chat GPT",
        GPT_PREFIX,
        fieldLabel,
        prevRows.filter((row) => row.alias.startsWith(GPT_PREFIX)).length,
      ),
      ...prevRows,
    ])
  }

  function addGemniRow() {
    setFieldRows((prevRows) => [
      createKMSRow(
        "Gemini",
        GEMINI_PREFIX,
        fieldLabel,
        prevRows.filter((row) => row.alias.startsWith(GEMINI_PREFIX)).length,
      ),
      ...prevRows,
    ])
  }

  function addYoutubeDataAPIV3Row() {
    setFieldRows((prevRows) => [
      createKMSRow(
        "Youtube Data API V3",
        YOUTUBE_DATA_API_V3_PREFIX,
        fieldLabel,
        prevRows.filter((row) =>
          row.alias.startsWith(YOUTUBE_DATA_API_V3_PREFIX),
        ).length,
      ),
      ...prevRows,
    ])
  }

  function removeLastGPTRow() {
    setFieldRows((prevRows) => prevRows.slice(1))
  }

  function removeGPTRow(alias: string) {
    setFieldRows((prevRows) => prevRows.filter((row) => row.alias !== alias))
  }

  function updateRow(alias: string, value: string) {
    setFieldRows((prevRows) =>
      prevRows.map((row) =>
        row.alias === alias
          ? {
              ...row,
              value,
            }
          : row,
      ),
    )
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="mb-4 flex flex-nowrap items-center gap-2 overflow-x-auto">
        <Button
          className="m-[10px] whitespace-nowrap"
          disabled={isDisabled}
          onClick={addGPTRow}
        >
          Add Chat GPT
        </Button>
        
        <Button
          className="m-[10px] whitespace-nowrap"
          disabled={isDisabled}
          onClick={addGemniRow}
        >
          Add Gemini
        </Button>
        
        <Button
          className="m-[10px] whitespace-nowrap"
          disabled={isDisabled}
          onClick={addYoutubeDataAPIV3Row}
        >
          Add Youtube API
        </Button>
        
        <Button
          className="m-[10px] whitespace-nowrap"
          disabled={isDisabled}
          onClick={removeLastGPTRow}
        >
          Remove Last Row
        </Button>

      </div>

      <form className="space-y-8">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>KMS Key Management</FieldLegend>
            <Input
              id="field-label"
              placeholder="New key value"
              value={fieldLabel}
              disabled={isDisabled}
              onChange={(e) => setFieldLabel(e.target.value)}
            />
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
                    <Input value={row.alias} readOnly />
                    <Input
                      id={`${row.alias}-value`}
                      value={row.value}
                      placeholder="key value"
                      disabled={isDisabled}
                      onChange={(e) => updateRow(row.alias, e.target.value)}
                    />


                    <Button
                      variant="outline"
                      type="button"
                      disabled={isDisabled}
                      onClick={() => removeGPTRow(row.alias)}
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
