'use client'

import { useMemo } from 'react'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className="p-2 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 hover:border-border transition-all"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-primary" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </motion.button>
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

export const mdxComponents = {
  h1: (props: any) => (
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-4xl font-bold mb-6 mt-8 scroll-mt-20"
      {...props}
    />
  ),
  h2: (props: any) => (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="text-3xl font-semibold mb-4 mt-8 pb-2 border-b border-border scroll-mt-20"
      {...props}
    />
  ),
  h3: (props: any) => (
    <motion.h3
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="text-2xl font-semibold mb-3 mt-6 scroll-mt-20"
      {...props}
    />
  ),
  h4: (props: any) => (
    <h4 className="text-xl font-semibold mb-2 mt-4 scroll-mt-20" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-4 leading-7 text-foreground/90" {...props} />
  ),
  ul: (props: any) => (
    <ul className="mb-4 ml-6 list-disc space-y-2" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mb-4 ml-6 list-decimal space-y-2" {...props} />
  ),
  li: (props: any) => <li className="mb-1" {...props} />,
  a: (props: any) => (
    <a
      className="text-primary hover:underline underline-offset-4"
      {...props}
    />
  ),
  code: (props: any) => {
    if (props.className) {
      return <CodeBlock {...props} />
    }
    return (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">
        {props.children}
      </code>
    )
  },
  pre: (props: any) => <>{props.children}</>,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary pl-4 italic my-4 text-muted-foreground"
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props} />
  ),
  td: (props: any) => (
    <td className="border border-border px-4 py-2" {...props} />
  ),
}

