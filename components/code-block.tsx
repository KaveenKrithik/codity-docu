'use client'

import { useMemo, useState } from 'react'
import { Copy, Check } from 'lucide-react'

export function CodeBlock({ children, className, ...props }: any) {
  const [copied, setCopied] = useState(false)
  const language = className?.replace('language-', '') || 'text'

  const code = useMemo(() => {
    if (typeof children === 'string') return children
    if (Array.isArray(children)) return children.join('')
    return String(children)
  }, [children])

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group my-6">
      <div className="absolute top-3 right-3">
        <button
          onClick={copyToClipboard}
          className="p-2 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-all hover:scale-105 active:scale-95"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>
      <pre className="bg-muted/50 border border-border rounded-lg p-4 overflow-x-auto">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
      {language !== 'text' && (
        <div className="absolute top-2 left-4">
          <span className="text-xs text-muted-foreground font-mono uppercase">
            {language}
          </span>
        </div>
      )}
    </div>
  )
}
