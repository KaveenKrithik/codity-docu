import { MDXContent } from '@/lib/mdx'

const content = `# Authentication

Codity uses API keys for authentication. This guide explains how to obtain, use, and secure your API keys.

## Getting Your API Key

1. Log in to your [Codity Dashboard](https://dashboard.codity.ai)
2. Navigate to **Settings** → **API Keys**
3. Click **Create New API Key**
4. Copy and securely store your key

> **Warning**: API keys are sensitive credentials. Never commit them to version control.

## Using API Keys

### HTTP Header

Include your API key in the Authorization header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.codity.ai/v1/projects
\`\`\`

### SDK

When using the Codity SDK:

\`\`\`javascript
import { CodityClient } from '@codity/sdk'

const client = new CodityClient({
  apiKey: process.env.CODITY_API_KEY,
})
\`\`\`

## Key Types

### Public Keys

Public keys are safe to use in client-side applications. They have limited permissions.

### Secret Keys

Secret keys have full access to your account. Keep them secure and never expose them publicly.

## Key Rotation

Regularly rotate your API keys for security:

1. Generate a new key
2. Update your applications
3. Revoke the old key

## Security Best Practices

- Store keys in environment variables
- Use different keys for different environments
- Rotate keys regularly
- Monitor key usage in the dashboard
- Revoke unused or compromised keys immediately

---

*Learn more about [Security](/security) practices.*`

export default function AuthenticationPage() {
  return <MDXContent source={content} />
}

