import type { ColumnDef } from "@tanstack/react-table"
 
export type YoutubeTableRow = {
  id: string
  source: "Search" | "Video" | "Channel"
  title: string
  channelTitle: string
  publishedAt: string
  viewCount: string
  subscriberCount: string
  videoCount: string
}

function formatPublishedDate(value: string) {
  if (!value || value === "-") {
    return "-"
  }

  return value.slice(0, 10)
}

function formatCount(value: string, suffix = "회") {
  const count = Number(value)

  if (!Number.isFinite(count)) {
    return "-"
  }

  if (count < 10000) {
    return `${count.toLocaleString()}${suffix}`
  }

  if (count < 100000000) {
    const tenThousands = count / 10000
    return `${formatCompactNumber(tenThousands)}만${suffix}`
  }

  const hundredMillions = count / 100000000
  return `${formatCompactNumber(hundredMillions)}억${suffix}`
}

function formatCompactNumber(value: number) {
  return value >= 100
    ? Math.round(value).toLocaleString()
    : value.toLocaleString(undefined, {
        maximumFractionDigits: 1,
      })
}
 
export const columns: ColumnDef<YoutubeTableRow>[] = [
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "channelTitle",
    header: "Channel",
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    cell: ({ row }) => formatPublishedDate(row.original.publishedAt),
  },
  {
    accessorKey: "viewCount",
    header: "Views",
    cell: ({ row }) => formatCount(row.original.viewCount),
  },
  {
    accessorKey: "subscriberCount",
    header: "Subscribers",
    cell: ({ row }) => formatCount(row.original.subscriberCount, "명"),
  },
  {
    accessorKey: "videoCount",
    header: "Videos",
    cell: ({ row }) => formatCount(row.original.videoCount, "개"),
  },
]
