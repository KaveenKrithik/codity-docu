import { MDXContent } from '@/lib/mdx'

const content = `# Introduction

Welcome to the **Codity Documentation**. This comprehensive guide will help you understand, integrate, and make the most of the Codity platform.

## What is Codity?

Codity is a powerful platform designed to streamline your development workflow and enhance productivity. Whether you're building web applications, managing APIs, or deploying services, Codity provides the tools you need.

## Key Features

- **Fast and Reliable**: Built for performance and scalability
- **Developer-Friendly**: Intuitive APIs and comprehensive documentation
- **Secure**: Enterprise-grade security features
- **Flexible**: Customize to fit your needs

## Getting Started

To begin using Codity, follow these steps:

1. **Sign up** for a Codity account
2. **Create** your first project
3. **Configure** your settings
4. **Start building** with our APIs

## Next Steps

- Read our [Quick Start Guide](/getting-started) to get up and running
- Explore the [API Reference](/api) for detailed endpoint documentation
- Check out our [Best Practices](/guides/best-practices) for tips and recommendations

---

*Need help? Check out our [Troubleshooting Guide](/guides/troubleshooting) or contact support.*`

export default function DocumentationPage() {
  return <MDXContent source={content} />
}

