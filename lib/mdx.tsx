import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteClient } from '../components/mdx-client'

export async function MDXContent({ source }: { source: string }) {
  const mdxSource = await serialize(source, {
    parseFrontmatter: false,
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  })
  
  return <MDXRemoteClient mdxSource={mdxSource} />
}

