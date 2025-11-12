import { MDXContent } from '@/lib/mdx'

const content = `# Security: Authentication

Authentication methods and security best practices.

## API Key Security

### Storage

Never store API keys in code:

\`\`\`javascript
// ❌ Bad
const apiKey = 'sk_live_1234567890'

// ✅ Good
const apiKey = process.env.CODITY_API_KEY
\`\`\`

### Rotation

Rotate keys regularly:

1. Generate new key in dashboard
2. Update all applications
3. Test thoroughly
4. Revoke old key

### Scoping

Use scoped keys with minimal permissions:

\`\`\`javascript
// Create scoped key for specific operations
const client = new CodityClient({
  apiKey: process.env.CODITY_READ_ONLY_KEY,
  scopes: ['projects:read']
})
\`\`\`

## Token Management

### JWT Tokens

\`\`\`javascript
// Verify JWT token
const jwt = require('jsonwebtoken')

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid token')
  }
}
\`\`\`

### Token Refresh

\`\`\`javascript
class TokenManager {
  constructor() {
    this.token = null
    this.expiresAt = null
  }
  
  async getToken() {
    if (this.token && Date.now() < this.expiresAt) {
      return this.token
    }
    
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${this.token}\` }
    })
    
    const data = await response.json()
    this.token = data.token
    this.expiresAt = Date.now() + (data.expires_in * 1000)
    
    return this.token
  }
}
\`\`\`

## Best Practices

1. **Use HTTPS** for all API communications
2. **Validate tokens** on every request
3. **Implement token refresh** before expiration
4. **Log authentication failures** for monitoring
5. **Use rate limiting** to prevent brute force attacks

---

*Learn about [Authorization](/security/authorization) for access control.*`

export default async function SecurityAuthenticationPage() {
  return <MDXContent source={content} />
}

