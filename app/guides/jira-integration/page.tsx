import { MDXContent } from '@/lib/mdx'

const content = `# JIRA Integration

Connect your JIRA instance to Codity to automatically extract ticket requirements and verify that your Pull Requests implement all acceptance criteria defined in your JIRA tickets.

## Setting Up JIRA Integration

### Step 1: Generate a JIRA API Token

1. Go to your JIRA account settings at [id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click **"Create API token"**
3. Give your token a label (e.g., "Codity Integration")
4. Copy the generated token - you'll need this in the next step

**Figure 9:** Generate a JIRA API token from your Atlassian account settings.

### Step 2: Configure JIRA in Codity Settings

1. Navigate to **Settings** in your Codity dashboard
2. Scroll down to the **"Integrations"** section
3. In the JIRA Integration card, fill in the following information:
   - **JIRA URL:** Your Atlassian instance URL (e.g., \`https://your-company.atlassian.net\`)
   - **JIRA Email:** The email address associated with your JIRA account
   - **JIRA API Token:** Paste the token you generated in Step 1
   - **Project Keys:** Comma-separated list of JIRA project keys you want to track (e.g., \`PROJ, DEV, FEATURE\`)
4. Click **"Test Connection"** to verify your credentials
5. Once the connection is successful, click **"Save Settings"**

## How It Works

1. **Link PRs to JIRA Tickets:** Include your JIRA ticket ID in your PR title or description.

   Examples: \`[PROJ-123] Add user authentication\`, \`Fix login bug (DEV-456)\`

2. **Automatic Extraction:** Codity will automatically detect the ticket ID and fetch the acceptance criteria from your JIRA ticket.

3. **Requirements Verification:** During the PR review, Codity will verify that your code changes implement all the requirements listed in the JIRA ticket's acceptance criteria.

4. **Feedback:** If any requirements are missing, Codity will post a comment on your PR highlighting which acceptance criteria haven't been addressed.

## Tips for Best Results

- Always include acceptance criteria as a bullet list in your JIRA ticket descriptions
- Use clear, specific acceptance criteria that can be verified in code
- Reference the JIRA ticket ID in your PR title for automatic detection
- Your API token is encrypted before storage for security

> **Note:** JIRA integration is configured per user and per organization. Each team member can set up their own JIRA credentials.`

export default async function JIRAIntegrationPage() {
  return <MDXContent source={content} />
}
