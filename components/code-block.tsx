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
    <div className="relative group my-10">
      <div className="absolute top-5 right-5 z-10">
        <button
          onClick={copyToClipboard}
          className="p-2.5 rounded-lg bg-background/95 hover:bg-background border border-border/50 hover:border-primary/50 transition-all opacity-0 group-hover:opacity-100 shadow-xl hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-md hover:scale-110"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          )}
        </button>
      </div>
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/60 via-primary to-primary/60 rounded-t-2xl shadow-lg shadow-primary/20" />
      <pre className="bg-secondary/60 border border-border/50 rounded-2xl p-7 overflow-x-auto shadow-xl shadow-black/10 backdrop-blur-sm">
        <code className={className} {...props}>
          {children}
        </code>
      </pre>
      {language !== 'text' && (
        <div className="absolute top-3 left-4">
          <span className="text-xs text-muted-foreground font-mono uppercase bg-secondary/80 px-2 py-1 rounded border border-border/40">
            {language}
          </span>
        </div>
      )}
    </div>
  )
}
