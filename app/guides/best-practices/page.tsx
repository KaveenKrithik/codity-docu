import { MDXContent } from '@/lib/mdx'

const content = `# Best Practices

Follow these best practices to ensure optimal performance and security when using Codity.

## API Usage

### Rate Limiting

Always respect rate limits and implement exponential backoff:

\`\`\`javascript
async function makeRequestWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options)
      if (response.ok) return response
      
      if (response.status === 429) {
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      throw new Error(\`Request failed: \${response.status}\`)
    } catch (error) {
      if (i === maxRetries - 1) throw error
    }
  }
}
\`\`\`

### Error Handling

Always handle errors gracefully:

\`\`\`javascript
try {
  const result = await client.projects.create(data)
  console.log('Project created:', result)
} catch (error) {
  if (error.code === 'VALIDATION_ERROR') {
    console.error('Invalid data:', error.details)
  } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
    console.error('Rate limit exceeded, please retry later')
  } else {
    console.error('Unexpected error:', error)
  }
}
\`\`\`

## Security

### API Key Management

- Never commit API keys to version control
- Use environment variables for all secrets
- Rotate keys regularly
- Use different keys for different environments

### Webhook Security

Always verify webhook signatures:

\`\`\`javascript
const crypto = require('crypto')

function verifyWebhook(signature, payload, secret) {
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(JSON.stringify(payload)).digest('hex')
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  )
}
\`\`\`

## Performance

### Caching

Implement caching for frequently accessed data:

\`\`\`javascript
const cache = new Map()

async function getCachedProject(id) {
  if (cache.has(id)) {
    return cache.get(id)
  }
  
  const project = await client.projects.get(id)
  cache.set(id, project)
  return project
}
\`\`\`

### Batch Operations

Use batch endpoints when available:

\`\`\`javascript
// Instead of multiple requests
const projects = await Promise.all(
  ids.map(id => client.projects.get(id))
)

// Use batch endpoint
const projects = await client.projects.batchGet(ids)
\`\`\`

---

*For troubleshooting, see our [Troubleshooting Guide](/guides/troubleshooting).*`

export default async function BestPracticesPage() {
  return <MDXContent source={content} />
}

