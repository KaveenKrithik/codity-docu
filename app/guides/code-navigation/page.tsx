import { MDXContent } from '@/lib/mdx'

const content = `# Code Navigation

Codity's Code Navigation feature is your AI-powered codebase assistant that helps you quickly understand code, find implementations, trace dependencies, and get answers about your repository—all directly within your Pull/Merge Request comments, without leaving your development flow.

## How to Use Code Navigation

You can start using code navigation by clicking on the tab on the dashboard sidebar or In any of your PR/MR comments (or even on Issues and Commits for GitLab), simply mention \`@codity\` followed by your question. Codity will analyze your codebase and provide contextual answers.

**Figure 10:** Start talking to your code base by selecting a repo.

## Example Queries

### Understanding Code Logic

\`\`\`
@codity Why is my calculateArea function returning incorrect values?
\`\`\`

\`\`\`
@codity Explain how the authentication flow works in this codebase
\`\`\`

### Finding Implementations

\`\`\`
@codity Where is the user login functionality implemented?
\`\`\`

\`\`\`
@codity Show me all files that handle database migrations
\`\`\`

### Architectural Questions

\`\`\`
@codity Explain the architecture of the 'auth' module
\`\`\`

\`\`\`
@codity How does the payment processing system integrate with the API?
\`\`\`

### Debugging & Troubleshooting

\`\`\`
@codity What could cause a null pointer exception in the UserService?
\`\`\`

\`\`\`
@codity Why might the API be returning 500 errors?
\`\`\`

### Code Dependencies

\`\`\`
@codity What files depend on the User model?
\`\`\`

\`\`\`
@codity Which modules are using the old authentication library?
\`\`\`

## Advanced Features

### Multi-Branch Search

For GitLab users, Codity supports searching across multiple branches simultaneously using the \`@codity navigate\` command. This is particularly useful when you need to compare implementations across different branches or find code in feature branches.

\`\`\`
@codity navigate Where is the payment gateway implemented?
\`\`\`

> **Note:** You can select which branches to search in the Code Navigation interface on the dashboard.

### Contextual Thread Responses

When you reply to existing comment threads (including diff comments), Codity automatically considers the context of previous messages in the thread. This allows for more natural, conversational interactions where you can ask follow-up questions without repeating context.

## Where Code Navigation Works

- **GitHub:** Pull Request comments (general and review comments)
- **GitLab:** Merge Request comments, Issue comments, and Commit comments

**Figure 11:** An example of Codity's response to a code navigation query.

> **Pro Tip:** The more specific your question, the better Codity can help! Include file names, function names, or module names when you know them for more targeted responses.`

export default async function CodeNavigationPage() {
  return <MDXContent source={content} />
}
