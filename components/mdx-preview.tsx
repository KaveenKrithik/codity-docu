'use client'

import { useEffect, useState } from 'react'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { mdxComponents } from './mdx-components'

interface MDXPreviewProps {
  source: string
}

export function MDXPreview({ source }: MDXPreviewProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMDX = async () => {
      try {
        const serialized = await serialize(source, {
          parseFrontmatter: false,
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
          },
        })
        setMdxSource(serialized)
      } catch (error) {
        console.error('Failed to serialize MDX:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMDX()
  }, [source])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading preview...</div>
      </div>
    )
  }

  if (!mdxSource) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-destructive">Failed to load preview</div>
      </div>
    )
  }

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <MDXRemote {...mdxSource} components={mdxComponents} />
    </div>
  )
}

