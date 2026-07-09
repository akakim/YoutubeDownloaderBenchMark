
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
// import crypto from 'crypto';

import ExcelJS, { type Borders, type FillPattern, type Style } from "exceljs"
import { saveAs } from "file-saver";

type AnalyzeRow = {
  id: string
  intent: string
  detail: string
  comment: string
}

const hermesPresetRows = [
  {
    intent: "유머(성적)",
    detail: "영상 0~3초 구간 거품 나오는 달팽이",
    comment: "댓글 없음",
  },
  {
    intent: "유머(실수)",
    detail: "영상 0~0.5초 구간 자막의 오타를 일부러 냄",
    comment: "댓글 없음",
  },
  {
    intent: "시청 지속시간 방어 ",
    detail: "승전 대본 문제점 발견, 해결책, 그리고 '끝이 아닙니다' 대본",
    comment: "댓글 없음",
  },
  {
    intent: "나도 모르게 다시보는 요소 ",
    detail: "영상 0~0.05초 구간 일부러 자막 오타냄",
    comment: "어 처음에 달행이엿는데 달팽이로 변함ㅋㅋ",
  },
{
    intent: "나도 모르게 다시보는 요소 ",
    detail: "영상이 순환함. 결론을 먼저 낸다음 문제제시(승), 해결(전) 문제제시(승), 해결(전) 와서 그래서 결국",
    comment: "댓글 없음",
  },
]

const FIELD_PREFIX= "analysis-field-";

function createAnalyzeRow(row: Omit<AnalyzeRow, "id">,index: number): AnalyzeRow {
  return {
    ...row,
    id: `${FIELD_PREFIX}${String(index)}`
  }
}

export function AnalyzeWidget() {
  const [fieldRows, setFieldRows] = useState<AnalyzeRow[]>([])

  const [shortsTitle, setShortsTitle] = useState("기본 쇼츠 제목")
  const [fieldLabel, setFieldLabel] = useState("")


  const generateExcelFile = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    // const randomId = crypto.randomUUID().split('-')[0];

    return `${month}${day}${hour}${minute}${second}`;
  };


  async function exportToExcel(videoTitle:string) {
    const workbook = new ExcelJS.Workbook();

    workbook.creator = `${videoTitle}_${generateExcelFile()}.xlsx`;


    const worksheet = workbook.addWorksheet(`${videoTitle}`);


  
    const headerFill: FillPattern = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCE6FF" },
    };

    const headerBorderStyle: Partial<Borders> = {
      left: { style: "thin", color: { argb: "FFBFBFBF" } },
      right: { style: "thin", color: { argb: "FFBFBFBF" } },
    };

    worksheet.columns = [
      { header: '의도(영상,대본)', key: 'intent', width: 10 },
      { header: '어떻게 (영상,대본)에 녹여냈는가', key: 'detail', width: 32 },
      { header: '(넣은요소에서) 댓글', key: 'comment', width: 32  },
    ];

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = headerFill;
      cell.border = headerBorderStyle;
    });

    fieldRows.forEach((row) => {
      worksheet.addRow([row.intent, row.detail, row.comment])
    })

    const fileName = `${videoTitle}_${generateExcelFile()}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, fileName);


  }

  function addRow(FieldName:string) {
    setFieldRows((prevRows) => [
      createAnalyzeRow({
        intent: FieldName,
        detail: "",
        comment: "",
      },
        prevRows.length),
      ...prevRows,
    ])
  }

  function addHermesPreset() {
    setFieldRows((prevRows) => [

      ...hermesPresetRows.map((row,index) => createAnalyzeRow(row,index)),
      ...prevRows,

    ])
  }

  function removeLastRow() {
      setFieldRows((prevRows) => prevRows.slice(1))

  }


  function removeRow(id: string) {
    setFieldRows((prevRows) => prevRows.filter((row) => row.id !== id))
  }

  function updateRow(id: string, key: keyof Omit<AnalyzeRow, "id">, value: string) {
    setFieldRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id
          ? {
              ...row,
              [key]: value,
            }
          : row,
      ),
    )
  }



  return (
    <div className="w-full max-w-3xl">

      <div className="flex flex-nowrap items-center gap-2 mb-4 overflow-x-auto">
          <Button className="m-[10px] whitespace-nowrap" onClick={
            () => addRow(fieldLabel)
          }> 항목 추가</Button>

          <Button className="m-[10px] whitespace-nowrap" onClick={
            () => removeLastRow()
          }> 항목 삭제</Button>

          <Button className="m-[10px] whitespace-nowrap" onClick={
            () => addHermesPreset()
          }>나만의 프리셋</Button>

          <Input className="m-[10px] w-[260px] min-w-[260px] max-w-[260px] whitespace-nowrap" id="shorts-title" placeholder="영상제목" value={shortsTitle} onChange={(e) => setShortsTitle(e.target.value)} />
          <Button className="m-[10px] whitespace-nowrap" onClick={
            () => exportToExcel(shortsTitle)
          }>Export to Excel</Button>
        </div>
       

      <form className="space-y-8">
        <FieldGroup>
          <FieldSet>
            <FieldLegend>대박영상 요소 체크</FieldLegend>
            <Input id="field-label" placeholder="체크리스트명" onChange={(e) => setFieldLabel(e.target.value)} />
            <FieldGroup>
              {fieldRows.map((row) => (
                <Field orientation="vertical">                  
                 <FieldLabel htmlFor={`${row.id}-detail`} className="m-[10px] w-[80px] min-w-[80px] whitespace-nowrap" >{row.intent}</FieldLabel>
                  
                  <div className="flex gap-2">
                    <Input id={`${row.id}-detail`} value={row.detail} placeholder="어떻게 구현하는가"onChange={(e) => updateRow(row.id, "detail", e.target.value)} />
                    <Input id={`${row.id}-comment`} value={row.comment} placeholder="시청자 댓글반응" onChange={(e) => updateRow(row.id, "comment", e.target.value)} />
                    <Button variant="outline" type="button" onClick={() => removeRow(row.id)}>
                      삭제
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

