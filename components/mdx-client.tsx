'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { mdxComponents } from '@/components/mdx-components'

interface MDXRemoteClientProps {
  mdxSource: MDXRemoteSerializeResult
}

export function MDXRemoteClient({ mdxSource }: MDXRemoteClientProps) {
  return (
    <MDXRemote {...mdxSource} components={mdxComponents} />
  )
}

