import { MDXContent } from '@/lib/mdx'
import { fetchSectionContent } from '@/lib/docOperations'

export const revalidate = 0

const fallbackContent = `# Performance

Optimize your Codity implementation for maximum performance.

## Overview

Codity is designed for high performance, but following best practices can help you get the most out of the platform.

## Key Areas

- **[Optimization](/performance/optimization)** - Performance optimization techniques
- **[Caching](/performance/caching)** - Caching strategies and implementation

## Quick Tips

1. **Use caching** for frequently accessed data
2. **Implement pagination** for large datasets
3. **Use batch operations** when available
4. **Monitor** your API usage and response times

---

*Learn more about [Optimization](/performance/optimization).*`

export default async function PerformancePage() {
  const content = await fetchSectionContent('performance-overview', fallbackContent)
  return <MDXContent source={content} />
}

