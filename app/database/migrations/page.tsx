import { MDXContent } from '@/lib/mdx'

const content = `# Database Migrations

Guide to managing database schema changes in Codity.

## Overview

Migrations allow you to version control and apply database schema changes safely.

## Creating Migrations

### Using CLI

\`\`\`bash
codity migrate create add_users_table
\`\`\`

### Migration File Structure

\`\`\`javascript
// migrations/001_add_users_table.js
exports.up = async (db) => {
  await db.query(\`
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    )
  \`)
}

exports.down = async (db) => {
  await db.query('DROP TABLE users')
}
\`\`\`

## Running Migrations

### Apply All Pending Migrations

\`\`\`bash
codity migrate up
\`\`\`

### Rollback Last Migration

\`\`\`bash
codity migrate down
\`\`\`

### Check Migration Status

\`\`\`bash
codity migrate status
\`\`\`

## Best Practices

1. **Always test migrations** in development first
2. **Create rollback scripts** for all migrations
3. **Use transactions** when possible
4. **Backup database** before running migrations
5. **Run migrations during low-traffic periods**

## Example Migration

\`\`\`javascript
exports.up = async (db) => {
  await db.query('BEGIN')
  
  try {
    await db.query(\`
      ALTER TABLE projects
      ADD COLUMN status VARCHAR(50) DEFAULT 'active'
    \`)
    
    await db.query(\`
      CREATE INDEX idx_projects_status ON projects(status)
    \`)
    
    await db.query('COMMIT')
  } catch (error) {
    await db.query('ROLLBACK')
    throw error
  }
}

exports.down = async (db) => {
  await db.query(\`
    ALTER TABLE projects
    DROP COLUMN status
  \`)
}
\`\`\`

---

*Review the [Schema](/database/schema) to understand the structure.*`

export default async function MigrationsPage() {
  return <MDXContent source={content} />
}

