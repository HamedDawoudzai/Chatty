interface LinkPreviewData { url: string; title: string; description: string; image: string }

interface LinkPreviewProps { data: LinkPreviewData }

export function LinkPreview({ data }: LinkPreviewProps) {
  const safeTitle = data.title.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return (
    <a href={data.url} target="_blank" rel="noreferrer noopener"
      className="block mt-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-brand-400 transition-colors max-w-sm">
      {data.image && <img src={data.image} alt="" className="w-full h-32 object-cover" />}
      <div className="p-3">
        <p className="font-semibold text-sm line-clamp-2" dangerouslySetInnerHTML={{ __html: safeTitle }} />
        {data.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{data.description}</p>}
        <p className="text-xs text-gray-400 mt-1 truncate">{data.url}</p>
      </div>
    </a>
  )
}
