import { MDXContent } from '@/lib/mdx'

const content = `# Guides

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

export default function GuidesPage() {
  return <MDXContent source={content} />
}

