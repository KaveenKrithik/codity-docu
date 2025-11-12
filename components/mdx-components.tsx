<<<<<<< Updated upstream
import { CodeBlock } from './code-block'
=======
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
    </div>
  )
}
>>>>>>> Stashed changes

export const mdxComponents = {
  h1: (props: any) => (
    <h1
<<<<<<< Updated upstream
      className="text-4xl font-bold mb-6 mt-8 scroll-mt-20"
=======
      className="text-5xl font-bold mb-10 mt-0 tracking-tight scroll-mt-20 relative"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--foreground)) 0%, hsl(var(--foreground) / 0.9) 50%, hsl(var(--primary)) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
>>>>>>> Stashed changes
      {...props}
    >
      {props.children}
      <span className="absolute bottom-0 left-0 w-24 h-1 bg-gradient-to-r from-primary to-primary/0 rounded-full" />
    </h1>
  ),
  h2: (props: any) => (
    <h2
<<<<<<< Updated upstream
      className="text-3xl font-semibold mb-4 mt-8 pb-2 border-b border-border scroll-mt-20"
=======
      className="text-3xl font-semibold mb-8 mt-16 tracking-tight first:mt-0 scroll-mt-20 text-foreground pb-3 border-b-2 border-border/30 relative"
>>>>>>> Stashed changes
      {...props}
    >
      <span className="absolute bottom-0 left-0 w-16 h-0.5 bg-primary rounded-full" />
      {props.children}
    </h2>
  ),
  h3: (props: any) => (
    <h3
<<<<<<< Updated upstream
      className="text-2xl font-semibold mb-3 mt-6 scroll-mt-20"
=======
      className="text-2xl font-semibold mb-5 mt-10 tracking-tight scroll-mt-20 text-foreground relative pl-4"
>>>>>>> Stashed changes
      {...props}
    >
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-full" />
      {props.children}
    </h3>
  ),
  h4: (props: any) => (
    <h4 className="text-lg font-semibold mb-3 mt-6 tracking-tight scroll-mt-20 text-foreground" {...props} />
  ),
  p: (props: any) => {
    const text = typeof props.children === 'string' ? props.children : ''
    if (text.startsWith('Figure') || text.startsWith('**Figure')) {
      return (
        <p className="mt-4 mb-2 text-sm text-muted-foreground font-normal">
          <span className="text-primary">📷</span> {props.children}
        </p>
      )
    }
    return <p className="mb-6 leading-7 text-foreground/90" {...props} />
  },
  img: (props: any) => {
    if (props.src === 'placeholder' || props.alt?.includes('placeholder')) {
      return (
        <div className="my-10 rounded-2xl border-2 border-dashed border-primary/40 bg-gradient-to-br from-secondary/50 via-secondary/30 to-transparent p-20 flex items-center justify-center backdrop-blur-sm shadow-inner">
          <div className="text-center">
            <div className="text-6xl mb-4 opacity-40">🖼️</div>
            <p className="text-sm font-semibold text-muted-foreground">Image Placeholder</p>
            <p className="text-xs text-muted-foreground/50 mt-1.5">Screenshot will be added here</p>
          </div>
        </div>
      )
    }
    return (
      <img
        className="my-8 rounded-xl border border-border/50 shadow-xl w-full transition-all hover:shadow-2xl hover:scale-[1.01]"
        {...props}
      />
    )
  },
  ul: (props: any) => (
    <ul className="mb-6 ml-6 list-disc space-y-3 [&>li]:marker:text-primary" {...props} />
  ),
  ol: (props: any) => (
    <ol className="mb-6 ml-6 list-decimal space-y-3 [&>li]:marker:text-primary [&>li]:marker:font-semibold" {...props} />
  ),
  li: (props: any) => <li className="leading-7 text-foreground/90" {...props} />,
  a: (props: any) => (
    <a
      className="text-primary underline underline-offset-4 decoration-primary/50 hover:decoration-primary transition-all font-medium hover:text-primary/90"
      {...props}
    />
  ),
  code: (props: any) => {
    if (props.className) {
      return <CodeBlock {...props} />
    }
    return (
      <code className="bg-secondary/80 px-2.5 py-1 rounded-lg text-sm font-mono text-foreground border border-border/40 shadow-sm">
        {props.children}
      </code>
    )
  },
  pre: (props: any) => <>{props.children}</>,
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-primary/60 pl-8 italic my-10 text-foreground/85 bg-gradient-to-r from-primary/5 via-secondary/20 to-transparent py-5 pr-6 rounded-r-xl relative shadow-sm"
      {...props}
    />
  ),
  table: (props: any) => (
    <div className="my-10 overflow-x-auto rounded-xl border border-border/50 shadow-lg">
      <table className="w-full border-collapse" {...props} />
    </div>
  ),
  th: (props: any) => (
    <th className="border border-border px-4 py-3 bg-gradient-to-b from-secondary to-secondary/80 font-semibold text-left text-foreground border-b-2 border-border" {...props} />
  ),
  td: (props: any) => (
    <td className="border border-border px-4 py-3 text-foreground/90" {...props} />
  ),
  hr: (props: any) => (
    <hr className="my-10 border-border/50 relative" {...props} />
  ),
  strong: (props: any) => {
    const text = typeof props.children === 'string' ? props.children : ''
    if (text.startsWith('Figure')) {
      return (
        <strong className="block mt-4 mb-2 text-sm text-muted-foreground font-normal">
          <span className="text-primary">📷</span> {props.children}
        </strong>
      )
    }
    return <strong className="font-semibold text-foreground" {...props} />
  },
  em: (props: any) => (
    <em className="italic text-foreground/90" {...props} />
  ),
}

