import { MDXContent } from '@/lib/mdx'

const content = `# Caching

Implement effective caching strategies to improve performance and reduce API calls.

## Caching Strategies

### 1. Client-Side Caching

Cache responses in your application:

\`\`\`javascript
class CodityCache {
  constructor() {
    this.cache = new Map()
    this.defaultTTL = 5 * 60 * 1000 // 5 minutes
  }
  
  get(key) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.value
  }
  
  set(key, value, ttl = this.defaultTTL) {
    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    })
  }
  
  invalidate(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}
\`\`\`

### 2. Redis Caching

For distributed applications, use Redis:

\`\`\`javascript
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

async function getCachedProject(id) {
  const cacheKey = \`project:\${id}\`
  const cached = await redis.get(cacheKey)
  
  if (cached) {
    return JSON.parse(cached)
  }
  
  const project = await client.projects.get(id)
  await redis.setex(cacheKey, 300, JSON.stringify(project))
  
  return project
}
\`\`\`

### 3. CDN Caching

For public data, use CDN caching:

\`\`\`javascript
// Set appropriate cache headers
res.setHeader('Cache-Control', 'public, max-age=3600')
res.setHeader('ETag', generateETag(data))
\`\`\`

## Cache Invalidation

### Time-Based Invalidation

\`\`\`javascript
// Cache expires after TTL
cache.set('key', value, 5 * 60 * 1000) // 5 minutes
\`\`\`

### Event-Based Invalidation

\`\`\`javascript
// Invalidate on webhook events
webhook.on('project.updated', (event) => {
  cache.invalidate(\`project:\${event.data.id}\`)
})
\`\`\`

## Best Practices

1. **Cache frequently accessed data** - Focus on data that doesn't change often
2. **Set appropriate TTLs** - Balance freshness with performance
3. **Invalidate on updates** - Keep cache consistent with source data
4. **Monitor cache hit rates** - Track cache effectiveness
5. **Use cache keys wisely** - Make keys descriptive and consistent

---

*Learn more about [Performance Optimization](/performance/optimization).*`

export default async function CachingPage() {
  return <MDXContent source={content} />
}

