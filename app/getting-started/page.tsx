import { MDXContent } from '@/lib/mdx'

const content = `# Getting Started with Codity

Get up and running with Codity in just a few minutes. This guide will walk you through connecting your repositories and configuring your first code reviews.

## Prerequisites

Before you begin, make sure you have:

- A GitHub or GitLab account
- Access to the repositories you want to connect
- Admin permissions (for organization-level setup)

## Connecting Your Repositories

### For GitHub Users

1. **Sign in to Codity** using your GitHub account
2. Navigate to the **Dashboard**
3. Click on the **"Add GitHub Repositories"** button
4. Follow the prompts to install the Codity GitHub App for your desired repositories or organization
5. Select the repositories you want Codity to monitor

The Codity GitHub App will be installed and configured automatically. You can manage which repositories Codity has access to from your GitHub settings.

### For GitLab Users

1. **Provide a GitLab Access Token** to Codity:
   - You can set this up in your Codity **Settings** or if prompted on the dashboard
   - Generate a token with appropriate permissions from your GitLab account settings

2. Once the token is added, navigate to the **Dashboard**
3. Click on the **"Enable Repositories"** button
4. Select the GitLab repositories you wish to monitor

## Initial Configuration

### Auto-Review Settings

Control whether Codity automatically reviews your PRs/MRs when they are opened or updated:

- **Auto-Review Enabled**: Codity will automatically provide review suggestions, code analysis, and summaries on your PRs/MRs as soon as they are opened or updated
- **Auto-Review Disabled**: You maintain full control and can request Codity's review assistance manually within your PR/MR comments by adding: \`@codity review\`

### Workflow Diagrams

Enable or disable visual workflow diagrams in your PR reviews:

- **Enabled**: Codity will automatically generate visual workflow diagrams showing function call flows, class relationships, module interactions, and architecture changes
- **Disabled**: Reviews will focus on textual analysis and code suggestions without generating visual diagrams

**Note**: Settings are saved per user and per organization/group, allowing different team members to have personalized preferences.

## Your First Review

Once your repositories are connected:

1. Open or update a Pull Request (GitHub) or Merge Request (GitLab)
2. If Auto-Review is enabled, Codity will automatically analyze the PR/MR
3. Review Codity's suggestions and feedback
4. Use \`@codity\` in comments for additional code navigation and questions

## Next Steps

- Learn about [PR Reviews](/guides/pr-reviews) in detail
- Set up [JIRA Integration](/guides/jira-integration) for ticket tracking
- Explore [Code Navigation](/guides/code-navigation) features
- Check out [Best Practices](/guides/best-practices) for optimal results

---

*Ready to dive deeper? Check out our [API Documentation](/api).*`

export default async function GettingStartedPage() {
  return <MDXContent source={content} />
}
