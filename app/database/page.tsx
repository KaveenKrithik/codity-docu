import { MDXContent } from '@/lib/mdx'

const content = `# Database

Learn about Codity's database structure and management.

## Overview

Codity uses a modern, scalable database architecture designed for performance and reliability.

## Topics

- **[Schema](/database/schema)** - Database structure and relationships
- **[Migrations](/database/migrations)** - Database migration guide

## Quick Reference

- All tables use UUIDs as primary keys
- Timestamps are stored in UTC
- Soft deletes are used for data retention
- Indexes are optimized for common queries

---

*Start with [Schema](/database/schema) to understand the structure.*`

export default function DatabasePage() {
  return <MDXContent source={content} />
}

