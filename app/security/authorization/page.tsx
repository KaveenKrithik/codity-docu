import { MDXContent } from '@/lib/mdx'

const content = `# Security: Authorization

Access control and permission management.

## Role-Based Access Control (RBAC)

### Roles

\`\`\`javascript
const roles = {
  admin: ['*'],
  developer: ['projects:read', 'projects:write', 'resources:read'],
  viewer: ['projects:read', 'resources:read']
}
\`\`\`

### Permission Checking

\`\`\`javascript
function hasPermission(user, resource, action) {
  const role = user.role
  const permissions = roles[role] || []
  
  return permissions.includes('*') || 
         permissions.includes(\`\${resource}:\${action}\`)
}

// Usage
if (hasPermission(user, 'projects', 'write')) {
  await createProject(data)
} else {
  throw new Error('Insufficient permissions')
}
\`\`\`

## Resource-Level Permissions

### Project Access

\`\`\`javascript
async function canAccessProject(userId, projectId) {
  const project = await db.query(
    'SELECT * FROM projects WHERE id = $1',
    [projectId]
  )
  
  // Check ownership
  if (project.owner_id === userId) return true
  
  // Check team membership
  const member = await db.query(
    'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
    [projectId, userId]
  )
  
  return member.length > 0
}
\`\`\`

## API-Level Authorization

### Middleware

\`\`\`javascript
function requirePermission(resource, action) {
  return async (req, res, next) => {
    const user = req.user
    
    if (!hasPermission(user, resource, action)) {
      return res.status(403).json({
        error: 'Insufficient permissions'
      })
    }
    
    next()
  }
}

// Usage
app.post('/projects', 
  requireAuth,
  requirePermission('projects', 'write'),
  createProject
)
\`\`\`

## Best Practices

1. **Principle of least privilege** - Grant minimum required permissions
2. **Regular audits** - Review permissions periodically
3. **Separate concerns** - Different keys for different purposes
4. **Log access** - Track who accesses what
5. **Time-bound access** - Set expiration for temporary access

---

*Review [Authentication](/security/authentication) for authentication methods.*`

export default function SecurityAuthorizationPage() {
  return <MDXContent source={content} />
}

