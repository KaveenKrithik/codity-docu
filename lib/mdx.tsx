import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx-components'

export function MDXContent({ source }: { source: string }) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <MDXRemote source={source} components={mdxComponents} />
    </article>
  )
}

