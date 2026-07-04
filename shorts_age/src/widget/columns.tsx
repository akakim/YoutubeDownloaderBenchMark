import type { ColumnDef } from "@tanstack/react-table"
 
export type YoutubeTableRow = {
  videoId: string
  source: "Search" | "Video" | "Channel"
  thumbnail: string
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
    accessorKey: "thumbnail",
    header: "Thumbnail",
    size: 140,
    cell: ({ row }) => {
      const thumbnail = row.original.thumbnail

      return thumbnail ? (
        <div className="h-[90px] w-[120px] min-w-[120px] overflow-hidden rounded bg-black">
          <img
            src={thumbnail}
            alt={row.original.title}
            width={120}
            height={90}
            className="block h-full w-full max-w-none object-contain"
          />
        </div>
      ) : (
        "-"
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    size: 560,
    cell: ({ row }) => (
      <div
        className="whitespace-normal break-words text-left leading-snug"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
        title={row.original.title}
      >
        {row.original.title}
      </div>
    ),
  },
  {
    accessorKey: "channelTitle",
    header: "Channel",
    size: 180,
  },
  {
    accessorKey: "publishedAt",
    header: "Published",
    size: 120,
    cell: ({ row }) => formatPublishedDate(row.original.publishedAt),
  },
  {
    accessorKey: "viewCount",
    header: "Views",
    size: 120,
    cell: ({ row }) => formatCount(row.original.viewCount),
  },
]
