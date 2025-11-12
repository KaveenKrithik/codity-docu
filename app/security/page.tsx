import { MDXContent } from '@/lib/mdx'

const content = `# Security

Security best practices and guidelines for using Codity.

## Overview

Security is a top priority at Codity. Follow these guidelines to keep your implementation secure.

## Topics

- **[Authentication](/security/authentication)** - Authentication methods and best practices
- **[Authorization](/security/authorization)** - Access control and permissions

## Security Checklist

- [ ] Use HTTPS for all API requests
- [ ] Store API keys securely (environment variables)
- [ ] Rotate API keys regularly
- [ ] Verify webhook signatures
- [ ] Implement rate limiting
- [ ] Use strong passwords
- [ ] Enable two-factor authentication
- [ ] Keep dependencies updated

---

*Start with [Authentication](/security/authentication).*`

export default async function SecurityPage() {
  return <MDXContent source={content} />
}

