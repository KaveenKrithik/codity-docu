import { MDXContent } from '@/lib/mdx'

const content = `# Installation

This guide covers different installation methods for Codity, depending on your use case and environment.

## Package Managers

### npm

\`\`\`bash
npm install @codity/sdk
\`\`\`

### yarn

\`\`\`bash
yarn add @codity/sdk
\`\`\`

### pnpm

\`\`\`bash
pnpm add @codity/sdk
\`\`\`

## CDN

You can also include Codity via CDN:

\`\`\`html
<script src="https://cdn.codity.ai/v1/sdk.js"></script>
\`\`\`

## Environment Variables

Create a \`.env\` file in your project root:

\`\`\`env
CODITY_API_KEY=your_api_key_here
CODITY_ENVIRONMENT=development
CODITY_REGION=us-east-1
\`\`\`

## Framework-Specific Setup

### Next.js

\`\`\`javascript
// lib/codity.js
import { CodityClient } from '@codity/sdk'

export const codity = new CodityClient({
  apiKey: process.env.CODITY_API_KEY,
})
\`\`\`

### React

\`\`\`javascript
// hooks/useCodity.js
import { useState, useEffect } from 'react'
import { CodityClient } from '@codity/sdk'

export function useCodity() {
  const [client] = useState(() => new CodityClient({
    apiKey: process.env.REACT_APP_CODITY_API_KEY,
  }))
  
  return client
}
\`\`\`

## Verification

Test your installation:

\`\`\`javascript
import { CodityClient } from '@codity/sdk'

const client = new CodityClient({
  apiKey: process.env.CODITY_API_KEY,
})

client.health.check()
  .then(() => console.log('✓ Codity is ready'))
  .catch(console.error)
\`\`\`

---

*Having issues? Check our [Troubleshooting Guide](/guides/troubleshooting).*`

export default async function InstallationPage() {
  return <MDXContent source={content} />
}

