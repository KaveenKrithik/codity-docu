import { MDXContent } from '@/lib/mdx'

const content = `# Troubleshooting

Common issues and their solutions when working with Codity.

## Authentication Issues

### Invalid API Key

**Problem**: Getting "Invalid API Key" errors.

**Solution**:
1. Verify your API key in the [Dashboard](https://dashboard.codity.ai)
2. Ensure the key is correctly set in your environment variables
3. Check for extra spaces or newlines in the key
4. Verify you're using the correct key for your environment

### Expired Token

**Problem**: Tokens expiring unexpectedly.

**Solution**:
- Tokens expire after 24 hours by default
- Implement token refresh logic
- Store tokens securely and refresh before expiration

## API Errors

### Rate Limit Exceeded

**Problem**: Receiving 429 (Too Many Requests) errors.

**Solution**:
\`\`\`javascript
// Implement exponential backoff
async function retryWithBackoff(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (error.status === 429 && i < retries - 1) {
        const delay = Math.pow(2, i) * 1000
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      throw error
    }
  }
}
\`\`\`

### Timeout Errors

**Problem**: Requests timing out.

**Solution**:
- Increase timeout values for long-running operations
- Implement request retries
- Check your network connection
- Verify API endpoint availability

## Webhook Issues

### Webhooks Not Firing

**Problem**: Webhooks not being received.

**Solution**:
1. Verify webhook URL is accessible
2. Check webhook configuration in dashboard
3. Ensure your server is listening on the correct port
4. Check firewall and security group settings
5. Review webhook logs in the dashboard

### Invalid Signature

**Problem**: Webhook signature verification failing.

**Solution**:
- Verify you're using the correct webhook secret
- Ensure payload is not modified before verification
- Check that you're using the raw request body

## Performance Issues

### Slow Response Times

**Problem**: API responses are slow.

**Solution**:
- Implement caching for frequently accessed data
- Use batch endpoints when available
- Optimize your request patterns
- Check your network latency
- Consider using a CDN

### High Memory Usage

**Problem**: Application using too much memory.

**Solution**:
- Implement pagination for large datasets
- Clear caches periodically
- Use streaming for large file operations
- Monitor memory usage and optimize queries

## Still Need Help?

If you're still experiencing issues:

1. Check our [API Reference](/api) for detailed documentation
2. Review [Best Practices](/guides/best-practices) for optimization tips
3. Contact support with:
   - Error messages
   - Request/response examples
   - Steps to reproduce
   - Environment details

---

*For more information, see our [API Documentation](/api).*`

export default async function TroubleshootingPage() {
  return <MDXContent source={content} />
}

