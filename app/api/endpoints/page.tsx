import { MDXContent } from '@/lib/mdx'

const content = `# API Endpoints

Complete reference for all Codity API endpoints.

## Projects

### List Projects

\`\`\`http
GET /v1/projects
\`\`\`

**Response:**

\`\`\`json
{
  "data": [
    {
      "id": "proj_123",
      "name": "My Project",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "per_page": 20
  }
}
\`\`\`

### Create Project

\`\`\`http
POST /v1/projects
Content-Type: application/json

{
  "name": "New Project",
  "description": "Project description"
}
\`\`\`

### Get Project

\`\`\`http
GET /v1/projects/:id
\`\`\`

### Update Project

\`\`\`http
PUT /v1/projects/:id
Content-Type: application/json

{
  "name": "Updated Name"
}
\`\`\`

### Delete Project

\`\`\`http
DELETE /v1/projects/:id
\`\`\`

## Resources

### List Resources

\`\`\`http
GET /v1/resources
\`\`\`

### Create Resource

\`\`\`http
POST /v1/resources
Content-Type: application/json

{
  "type": "database",
  "config": {}
}
\`\`\`

## Webhooks

### List Webhooks

\`\`\`http
GET /v1/webhooks
\`\`\`

### Create Webhook

\`\`\`http
POST /v1/webhooks
Content-Type: application/json

{
  "url": "https://example.com/webhook",
  "events": ["project.created", "project.updated"]
}
\`\`\`

---

*For authentication details, see [Authentication](/api/authentication).*`

export default function EndpointsPage() {
  return <MDXContent source={content} />
}

