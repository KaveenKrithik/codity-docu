import { MDXContent } from '@/lib/mdx'
import { fetchSectionContent } from '@/lib/docOperations'

export const revalidate = 0

const fallbackContent = `# Guides

Comprehensive guides to help you get the most out of Codity.

## Available Guides

- **[Best Practices](/guides/best-practices)** - Recommended practices and patterns
- **[Troubleshooting](/guides/troubleshooting)** - Common issues and solutions

## Getting Help

If you can't find what you're looking for:

- Check our [Troubleshooting Guide](/guides/troubleshooting)
- Browse the [API Reference](/api)
- Contact our support team

---

*Start with [Best Practices](/guides/best-practices) to learn recommended patterns.*`

export default async function GuidesPage() {
  const content = await fetchSectionContent('guides-overview', fallbackContent)
  return <MDXContent source={content} />
}

