import { MDXContent } from '@/lib/mdx'

const content = `# Webhooks

Webhooks allow you to receive real-time notifications about events in your Codity account.

## Overview

Webhooks are HTTP callbacks that Codity sends to your server when specific events occur. This enables you to:

- Sync data in real-time
- Trigger automated workflows
- Monitor account activity
- Integrate with external systems

## Setting Up Webhooks

### 1. Create a Webhook Endpoint

Create an endpoint on your server to receive webhook events:

\`\`\`javascript
// Express.js example
app.post('/webhooks/codity', (req, res) => {
  const event = req.body
  
  // Verify webhook signature
  const signature = req.headers['x-codity-signature']
  if (!verifySignature(signature, req.body)) {
    return res.status(401).send('Invalid signature')
  }
  
  // Process event
  handleEvent(event)
  
  res.status(200).send('OK')
})
\`\`\`

### 2. Register Your Webhook

Register your webhook endpoint with Codity:

\`\`\`bash
curl -X POST https://api.codity.ai/v1/webhooks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://yourdomain.com/webhooks/codity",
    "events": ["project.created", "project.updated"]
  }'
\`\`\`

## Available Events

- \`project.created\` - A new project is created
- \`project.updated\` - A project is updated
- \`project.deleted\` - A project is deleted
- \`resource.created\` - A resource is created
- \`resource.updated\` - A resource is updated

## Webhook Payload

\`\`\`json
{
  "id": "evt_123456",
  "type": "project.created",
  "data": {
    "id": "proj_123",
    "name": "My Project"
  },
  "created_at": "2024-01-01T00:00:00Z"
}
\`\`\`

## Security

Always verify webhook signatures to ensure requests are from Codity:

\`\`\`javascript
const crypto = require('crypto')

function verifySignature(signature, payload) {
  const secret = process.env.CODITY_WEBHOOK_SECRET
  const hmac = crypto.createHmac('sha256', secret)
  const digest = hmac.update(JSON.stringify(payload)).digest('hex')
  return signature === digest
}
\`\`\`

## Retry Logic

Codity will retry failed webhook deliveries:

- Immediate retry after 1 second
- Retry after 5 seconds
- Retry after 30 seconds
- Retry after 5 minutes
- Retry after 1 hour

---

*Learn more about [API Endpoints](/api/endpoints).*`

export default async function WebhooksPage() {
  return <MDXContent source={content} />
}

