import { MDXContent } from '@/lib/mdx'

const content = `# Quick Start Guide

Get started with Codity in just a few minutes. This guide will walk you through the essential steps to set up and use Codity.

## Prerequisites

Before you begin, make sure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Codity account (sign up at [codity.ai](https://codity.ai))

## Installation

Install the Codity SDK using npm:

\`\`\`bash
npm install @codity/sdk
\`\`\`

Or using yarn:

\`\`\`bash
yarn add @codity/sdk
\`\`\`

## Configuration

Create a configuration file in your project root:

\`\`\`javascript
// codity.config.js
export default {
  apiKey: process.env.CODITY_API_KEY,
  environment: process.env.NODE_ENV || 'development',
  region: 'us-east-1',
}
\`\`\`

## Your First Request

Here's a simple example to get you started:

\`\`\`javascript
import { CodityClient } from '@codity/sdk'

const client = new CodityClient({
  apiKey: process.env.CODITY_API_KEY,
})

async function main() {
  const response = await client.projects.list()
  console.log('Projects:', response.data)
}

main().catch(console.error)
\`\`\`

## Authentication

All API requests require authentication. Include your API key in the request headers:

\`\`\`javascript
const headers = {
  'Authorization': \`Bearer \${apiKey}\`,
  'Content-Type': 'application/json',
}
\`\`\`

## Next Steps

- Explore the [API Reference](/api) for detailed endpoint documentation
- Learn about [Best Practices](/guides/best-practices)
- Set up [Webhooks](/api/webhooks) for real-time updates

---

*Ready to dive deeper? Check out our [API Documentation](/api).*`

export default function GettingStartedPage() {
  return <MDXContent source={content} />
}

