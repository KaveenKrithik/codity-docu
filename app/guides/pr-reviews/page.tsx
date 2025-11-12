import { MDXContent } from '@/lib/mdx'

const content = `# PR Reviews

Codity helps streamline your Pull Request (PR) and Merge Request (MR) review process by providing insights and automation.

## Getting Started with PR Reviews

To enable PR review insights and automation, you first need to connect your repositories:

### For GitHub Users

1. Sign in to Codity using your GitHub account.
2. Navigate to the **Dashboard**.
3. Click on the **"Add GitHub Repositories"** button.

**Figure 1:** Click the "Add GitHub Repositories" button on the Dashboard.

4. Follow the prompts to install the Codity GitHub App for your desired repositories or organization.

**Figure 2:** Authorize and install the Codity GitHub App.

### For GitLab Users

1. First, you need to provide a GitLab Access Token to Codity. This is required for Codity to interact with your GitLab instance. You can set this up in your Codity **Settings** or if prompted on the dashboard.

**Figure 3:** Enter your GitLab Access Token in the modal.

2. Once the token is added, navigate to the **Dashboard**.
3. Click on the **"Enable Repositories"** button.

**Figure 4:** Click the "Enable Repositories" button on the Dashboard.

4. Select the GitLab repositories you wish to monitor.

**Figure 5:** Select the GitLab repositories to enable Codity for.

## Settings & Customization

Codity provides several customization options in the **Settings** page to tailor your experience.

### Auto-Review Toggle

Control whether Codity automatically reviews your PRs/MRs when they are opened or updated.

**Figure 6:** Toggle Auto-Review ON/OFF in Codity Settings.

- **Auto-Review Enabled:** Codity will automatically provide review suggestions, code analysis, and summaries on your PRs/MRs as soon as they are opened or updated.

- **Auto-Review Disabled:** You maintain full control and can request Codity's review assistance manually within your PR/MR comments. Simply add a comment with:

\`\`\`
@codity review
\`\`\`

**Figure 7:** Example of using \`@codity review\` in a PR comment.

### Workflow Diagrams Toggle

Enable or disable visual workflow diagrams in your PR reviews. This setting is configured per user and per organization/group.

**Workflow Diagrams Enabled:** Codity will automatically generate visual workflow diagrams showing:

- Function call flows and execution paths
- Class relationships and dependencies
- Module interactions and data flow
- Architecture changes introduced by the PR

These diagrams help you quickly understand the impact of code changes and visualize complex logic flows without having to trace through the code manually.

**Workflow Diagrams Disabled:** Reviews will focus on textual analysis and code suggestions without generating visual diagrams. This can speed up the review process if you prefer text-based feedback only.

> **Tip:** Settings are saved per user and per organization/group. This allows different team members to have personalized preferences for their workflow.`

export default async function PRReviewsPage() {
  return <MDXContent source={content} />
}
