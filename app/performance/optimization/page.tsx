import { MDXContent } from '@/lib/mdx'

const content = `# Performance Optimization

Techniques to optimize your Codity implementation for better performance.

## Request Optimization

### Batch Requests

Instead of making multiple individual requests, use batch endpoints:

\`\`\`javascript
// ❌ Slow: Multiple requests
const projects = await Promise.all([
  client.projects.get('id1'),
  client.projects.get('id2'),
  client.projects.get('id3'),
])

// ✅ Fast: Single batch request
const projects = await client.projects.batchGet(['id1', 'id2', 'id3'])
\`\`\`

### Request Deduplication

Avoid duplicate requests:

\`\`\`javascript
const requestCache = new Map()

async function getProject(id) {
  if (requestCache.has(id)) {
    return requestCache.get(id)
  }
  
  const promise = client.projects.get(id)
  requestCache.set(id, promise)
  
  try {
    const result = await promise
    return result
  } finally {
    requestCache.delete(id)
  }
}
\`\`\`

## Caching Strategies

### In-Memory Caching

\`\`\`javascript
class ProjectCache {
  constructor(ttl = 5 * 60 * 1000) {
    this.cache = new Map()
    this.ttl = ttl
  }
  
  get(id) {
    const item = this.cache.get(id)
    if (!item) return null
    
    if (Date.now() > item.expires) {
      this.cache.delete(id)
      return null
    }
    
    return item.data
  }
  
  set(id, data) {
    this.cache.set(id, {
      data,
      expires: Date.now() + this.ttl
    })
  }
}
\`\`\`

### HTTP Caching

Use HTTP cache headers:

\`\`\`javascript
const response = await fetch(url, {
  headers: {
    'If-None-Match': etag,
    'Cache-Control': 'max-age=300'
  }
})
\`\`\`

## Pagination

Always use pagination for large datasets:

\`\`\`javascript
async function getAllProjects() {
  const allProjects = []
  let page = 1
  let hasMore = true
  
  while (hasMore) {
    const response = await client.projects.list({ page, per_page: 100 })
    allProjects.push(...response.data)
    hasMore = response.meta.has_more
    page++
  }
  
  return allProjects
}
\`\`\`

## Connection Pooling

Reuse HTTP connections:

\`\`\`javascript
import https from 'https'

const agent = new https.Agent({
  keepAlive: true,
  maxSockets: 10
})

const client = new CodityClient({
  apiKey: process.env.API_KEY,
  httpAgent: agent
})
\`\`\`

---

*Learn about [Caching](/performance/caching) strategies.*`

export default async function OptimizationPage() {
  return <MDXContent source={content} />
}

