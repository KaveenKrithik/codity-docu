import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx-components'
import type { MDXComponents } from 'mdx/types'

export function MDXContent({ source }: { source: string }) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <MDXRemote source={source} components={mdxComponents as MDXComponents} />
    </article>
  )
}

