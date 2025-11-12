import { MDXContent } from '@/lib/mdx'

const content = `# API Reference

Complete reference for all Codity API endpoints, including request/response formats, authentication, and error handling.

## Base URL

All API requests should be made to:

\`\`\`
https://api.codity.ai/v1
\`\`\`

## Authentication

All API requests require authentication using an API key. Include it in the Authorization header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.codity.ai/v1/projects
\`\`\`

## Rate Limits

API requests are rate-limited to ensure fair usage:

- **Free tier**: 100 requests/minute
- **Pro tier**: 1,000 requests/minute
- **Enterprise**: Custom limits

Rate limit headers are included in all responses:

\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
\`\`\`

## Response Format

All API responses follow a consistent format:

\`\`\`json
{
  "data": {},
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "request_id": "req_123456"
  }
}
\`\`\`

## Error Handling

Errors are returned with appropriate HTTP status codes:

\`\`\`json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is invalid",
    "details": {}
  }
}
\`\`\`

## Endpoints

### Projects

- \`GET /projects\` - List all projects
- \`POST /projects\` - Create a new project
- \`GET /projects/:id\` - Get project details
- \`PUT /projects/:id\` - Update project
- \`DELETE /projects/:id\` - Delete project

### Resources

- \`GET /resources\` - List resources
- \`POST /resources\` - Create resource
- \`GET /resources/:id\` - Get resource details

---

*For detailed endpoint documentation, see [Endpoints](/api/endpoints).*`

export default async function APIPage() {
  return <MDXContent source={content} />
}

