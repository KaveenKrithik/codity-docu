import { MDXContent } from '@/lib/mdx'

const content = `# Database Schema

Overview of Codity's database structure and relationships.

## Core Tables

### Projects

\`\`\`sql
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
\`\`\`

### Resources

\`\`\`sql
CREATE TABLE resources (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  type VARCHAR(50) NOT NULL,
  config JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

### Webhooks

\`\`\`sql
CREATE TABLE webhooks (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  url VARCHAR(500) NOT NULL,
  events TEXT[] NOT NULL,
  secret VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
\`\`\`

## Relationships

- **Projects** have many **Resources**
- **Projects** have many **Webhooks**
- **Resources** belong to one **Project**

## Indexes

\`\`\`sql
CREATE INDEX idx_resources_project_id ON resources(project_id);
CREATE INDEX idx_webhooks_project_id ON webhooks(project_id);
CREATE INDEX idx_projects_created_at ON projects(created_at);
\`\`\`

---

*Learn about [Migrations](/database/migrations) to manage schema changes.*`

export default async function SchemaPage() {
  return <MDXContent source={content} />
}

