import { columns } from "./columns"
import type { YoutubeTableRow } from "./columns"
import { DataTable } from "./data-table"

interface YoutubePageProps {
  data: YoutubeTableRow[]
}

export default function YoutubePage({ data }: YoutubePageProps) {
  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
